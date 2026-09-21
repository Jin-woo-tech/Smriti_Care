import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = Router();

// Get list of linked patients for caregiver
router.get('/patients', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const caregiverId = req.user?.id;

    // Get linked patients from caregiver_relationships
    const relationships = db.prepare(`
      SELECT cr.id as relationshipId, cr.patient_id as patientId, cr.relationship_type as relationshipType,
             cr.is_primary as isPrimary, cr.emergency_contact as emergencyContact,
             u.full_name as fullName, u.username, u.email, u.phone, u.date_of_birth as dateOfBirth,
             p.age, p.gender, p.location, p.condition, p.avatar_color as avatarColor, p.avatar_initials as avatarInitials
      FROM caregiver_relationships cr
      JOIN users u ON cr.patient_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE cr.caregiver_id = ?
    `).all(caregiverId) as any[];

    // For each patient, compute quick cognitive score & today's medication completion
    const todayDate = new Date().toISOString().split('T')[0];

    const enhancedPatients = relationships.map(patient => {
      // Get cognitive average
      const cogScores = db.prepare('SELECT score FROM cognitive_metrics WHERE user_id = ?').all(patient.patientId) as { score: number }[];
      const avgCog = cogScores.length > 0
        ? Math.round(cogScores.reduce((acc, c) => acc + Number(c.score), 0) / cogScores.length)
        : 82;

      // Get today's medication status
      const totalMeds = db.prepare('SELECT count(*) as count FROM medications WHERE user_id = ? AND active = 1').get(patient.patientId) as { count: number };
      const takenLogs = db.prepare('SELECT count(*) as count FROM medication_logs WHERE user_id = ? AND date = ? AND status = "taken"').get(patient.patientId, todayDate) as { count: number };

      return {
        ...patient,
        cognitiveScore: avgCog,
        totalActiveMedications: totalMeds?.count || 0,
        todayMedicationsTaken: takenLogs?.count || 0,
        status: avgCog < 60 ? 'needs_attention' : 'stable',
      };
    });

    res.json(enhancedPatients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch linked patients' });
  }
});

// Link patient to caregiver
router.post('/link', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const caregiverId = req.user?.id;
    const { patientIdentifier, relationshipType = 'Family Member', isPrimary = true } = req.body;

    if (!patientIdentifier) {
      res.status(400).json({ error: 'Patient username, email, or ID is required' });
      return;
    }

    const patient = db.prepare(`
      SELECT id, full_name as fullName, role FROM users
      WHERE id = ? OR username = ? OR email = ?
    `).get(patientIdentifier, patientIdentifier, patientIdentifier) as any;

    if (!patient) {
      res.status(404).json({ error: 'Patient account not found with this identifier' });
      return;
    }

    // Check if relationship already exists
    const existing = db.prepare(`
      SELECT id FROM caregiver_relationships WHERE caregiver_id = ? AND patient_id = ?
    `).get(caregiverId, patient.id);

    if (existing) {
      res.status(409).json({ error: 'This patient is already linked to your account' });
      return;
    }

    const relId = uuidv4();
    db.prepare(`
      INSERT INTO caregiver_relationships (id, caregiver_id, patient_id, relationship_type, is_primary)
      VALUES (?, ?, ?, ?, ?)
    `).run(relId, caregiverId, patient.id, relationshipType, isPrimary ? 1 : 0);

    res.status(201).json({
      message: `Successfully linked ${patient.fullName} to your caregiver portal`,
      patientId: patient.id,
      patientName: patient.fullName,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to link patient' });
  }
});

// Get comprehensive 360 patient overview for caregiver
router.get('/summary/:patientId', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { patientId } = req.params;

    const patient = db.prepare(`
      SELECT u.id, u.full_name as fullName, u.phone, u.emergency_contact_name as emergencyContactName,
             u.emergency_contact_phone as emergencyContactPhone, p.age, p.gender, p.location, p.condition,
             p.notes, p.avatar_initials as avatarInitials, p.avatar_color as avatarColor
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `).get(patientId) as any;

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    // Cognitive Metrics
    const cognitiveMetrics = db.prepare(`
      SELECT domain, score, baseline_score as baselineScore, status, trend_direction as trendDirection, last_tested_date as lastTestedDate
      FROM cognitive_metrics WHERE user_id = ?
    `).all(patientId);

    // Active Medications
    const medications = db.prepare(`
      SELECT id, name, dosage, frequency, times, instructions, notes
      FROM medications WHERE user_id = ? AND active = 1
    `).all(patientId);

    // Today's Medication Logs
    const todayLogs = db.prepare(`
      SELECT l.id, l.medication_id as medicationId, m.name as medicationName, m.dosage,
             l.scheduled_time as scheduledTime, l.actual_time as actualTime, l.status
      FROM medication_logs l
      JOIN medications m ON l.medication_id = m.id
      WHERE l.user_id = ? AND l.date = ?
    `).all(patientId, todayDate);

    // Recent Game Sessions
    const recentGames = db.prepare(`
      SELECT game_type as gameType, domain, score, max_score as maxScore, level_reached as levelReached, created_at as createdAt
      FROM game_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `).all(patientId);

    res.json({
      patient,
      cognitiveMetrics,
      medications: medications.map((m: any) => ({
        ...m,
        times: typeof m.times === 'string' ? JSON.parse(m.times || '[]') : m.times,
      })),
      todayLogs,
      recentGames,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch patient summary' });
  }
});

export default router;
