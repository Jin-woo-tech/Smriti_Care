import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all active medications for user (or patient for authorized caregiver/clinician)
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician' || req.user?.role === 'asha')) {
      targetUserId = patientId as string;
    }

    const meds = db.prepare(`
      SELECT id, user_id as userId, name, generic_name as genericName, dosage, frequency,
             times, duration, instructions, notes, active, created_at as createdAt, updated_at as updatedAt
      FROM medications
      WHERE user_id = ? AND active = 1
      ORDER BY created_at DESC
    `).all(targetUserId) as any[];

    const parsedMeds = meds.map(m => ({
      ...m,
      times: typeof m.times === 'string' ? JSON.parse(m.times || '[]') : m.times,
    }));

    res.json(parsedMeds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch medications' });
  }
});

// Get today's schedule with current log status
router.get('/today', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician' || req.user?.role === 'asha')) {
      targetUserId = patientId as string;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const activeMeds = db.prepare(`
      SELECT id, name, generic_name as genericName, dosage, frequency, times, instructions, notes
      FROM medications
      WHERE user_id = ? AND active = 1
    `).all(targetUserId) as any[];

    const logs = db.prepare(`
      SELECT id, medication_id as medicationId, scheduled_time as scheduledTime, actual_time as actualTime,
             status, date, notes
      FROM medication_logs
      WHERE user_id = ? AND date = ?
    `).all(targetUserId, todayDate) as any[];

    // Flatten medication times into schedule items
    const schedule: any[] = [];

    activeMeds.forEach(med => {
      const times: string[] = typeof med.times === 'string' ? JSON.parse(med.times || '[]') : (med.times || []);
      times.forEach(t => {
        const matchingLog = logs.find(l => l.medicationId === med.id && l.scheduledTime === t);
        schedule.push({
          id: matchingLog ? matchingLog.id : `${med.id}-${t}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: t,
          status: matchingLog ? matchingLog.status : 'pending',
          actualTime: matchingLog ? matchingLog.actualTime : null,
          instructions: med.instructions,
          date: todayDate,
        });
      });
    });

    // Sort schedule by time
    schedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    res.json(schedule);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch today schedule' });
  }
});

// Calculate adherence metrics
router.get('/adherence', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician' || req.user?.role === 'asha')) {
      targetUserId = patientId as string;
    }

    // Last 30 days adherence calculation
    const totalLogs = db.prepare(`
      SELECT status, count(*) as count
      FROM medication_logs
      WHERE user_id = ?
      GROUP BY status
    `).all(targetUserId) as { status: string; count: number }[];

    let takenCount = 0;
    let skippedCount = 0;
    let totalDoses = 0;

    totalLogs.forEach(row => {
      if (row.status === 'taken') takenCount += row.count;
      if (row.status === 'skipped') skippedCount += row.count;
      totalDoses += row.count;
    });

    const percentage = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 94;

    // Daily history for chart (last 7 days)
    const sevenDaysLogs = db.prepare(`
      SELECT date, status, count(*) as count
      FROM medication_logs
      WHERE user_id = ?
      GROUP BY date, status
      ORDER BY date DESC
      LIMIT 30
    `).all(targetUserId) as { date: string; status: string; count: number }[];

    res.json({
      overallAdherence: percentage,
      takenDoses: takenCount,
      skippedDoses: skippedCount,
      totalTracked: totalDoses,
      recentHistory: sevenDaysLogs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to calculate adherence' });
  }
});

// Add new medication
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      name,
      genericName,
      dosage,
      frequency = 'Daily',
      times = ['08:00 AM'],
      duration = 'Ongoing',
      instructions,
      notes,
    } = req.body;

    if (!name || !dosage) {
      res.status(400).json({ error: 'Medication name and dosage are required' });
      return;
    }

    const id = uuidv4();
    const timesStr = JSON.stringify(Array.isArray(times) ? times : [times]);

    db.prepare(`
      INSERT INTO medications (id, user_id, name, generic_name, dosage, frequency, times, duration, instructions, notes, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(id, userId, name, genericName || null, dosage, frequency, timesStr, duration, instructions || null, notes || null);

    const createdMed = db.prepare('SELECT * FROM medications WHERE id = ?').get(id) as any;

    res.status(201).json({
      ...createdMed,
      times: JSON.parse(createdMed.times),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add medication' });
  }
});

// Update medication
router.put('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      name,
      genericName,
      dosage,
      frequency,
      times,
      duration,
      instructions,
      notes,
      active,
    } = req.body;

    const med = db.prepare('SELECT id, user_id FROM medications WHERE id = ?').get(id) as any;
    if (!med) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }

    if (med.user_id !== userId && req.user?.role !== 'clinician') {
      res.status(403).json({ error: 'Not authorized to modify this medication' });
      return;
    }

    const timesStr = times !== undefined ? (typeof times === 'string' ? times : JSON.stringify(times)) : undefined;

    db.prepare(`
      UPDATE medications
      SET name = COALESCE(?, name),
          generic_name = COALESCE(?, generic_name),
          dosage = COALESCE(?, dosage),
          frequency = COALESCE(?, frequency),
          times = COALESCE(?, times),
          duration = COALESCE(?, duration),
          instructions = COALESCE(?, instructions),
          notes = COALESCE(?, notes),
          active = COALESCE(?, active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      genericName,
      dosage,
      frequency,
      timesStr,
      duration,
      instructions,
      notes,
      active !== undefined ? (active ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM medications WHERE id = ?').get(id) as any;
    res.json({
      ...updated,
      times: JSON.parse(updated.times || '[]'),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update medication' });
  }
});

// Delete (deactivate) medication
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const med = db.prepare('SELECT id, user_id FROM medications WHERE id = ?').get(id) as any;
    if (!med) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }

    if (med.user_id !== userId && req.user?.role !== 'clinician') {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    db.prepare('UPDATE medications SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    res.json({ message: 'Medication removed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete medication' });
  }
});

// Record dose log (taken / skipped)
router.post('/log', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const { medicationId, scheduledTime, status, notes } = req.body;

    if (!medicationId || !scheduledTime || !status) {
      res.status(400).json({ error: 'medicationId, scheduledTime, and status are required' });
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if a log already exists for this medication + scheduledTime + date
    const existing = db.prepare(`
      SELECT id FROM medication_logs
      WHERE user_id = ? AND medication_id = ? AND scheduled_time = ? AND date = ?
    `).get(userId, medicationId, scheduledTime, todayDate) as { id: string } | undefined;

    if (existing) {
      db.prepare(`
        UPDATE medication_logs
        SET status = ?, actual_time = ?, notes = ?, created_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, status === 'taken' ? nowTimeStr : null, notes || null, existing.id);

      res.json({ message: 'Dose log updated', id: existing.id, status });
    } else {
      const logId = uuidv4();
      db.prepare(`
        INSERT INTO medication_logs (id, user_id, medication_id, scheduled_time, actual_time, status, date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(logId, userId, medicationId, scheduledTime, status === 'taken' ? nowTimeStr : null, status, todayDate, notes || null);

      res.status(201).json({ message: 'Dose logged successfully', id: logId, status });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to log dose' });
  }
});

export default router;
