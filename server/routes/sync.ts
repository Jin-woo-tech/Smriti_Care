import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Process offline synchronization queue
router.post('/batch', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user?.id;
  const { actions } = req.body; // Array of { id, type, payload, timestamp }

  if (!Array.isArray(actions) || actions.length === 0) {
    res.json({ message: 'No actions to sync', processed: 0 });
    return;
  }

  const results: any[] = [];

  const syncTransaction = db.transaction((items: any[]) => {
    for (const item of items) {
      try {
        const { type, payload } = item;

        if (type === 'LOG_MEDICATION') {
          const { medicationId, scheduledTime, status, date, notes } = payload;
          const logDate = date || new Date().toISOString().split('T')[0];
          const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const existing = db.prepare(`
            SELECT id FROM medication_logs
            WHERE user_id = ? AND medication_id = ? AND scheduled_time = ? AND date = ?
          `).get(userId, medicationId, scheduledTime, logDate) as { id: string } | undefined;

          if (existing) {
            db.prepare(`
              UPDATE medication_logs SET status = ?, actual_time = ?, notes = ?, created_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).run(status, status === 'taken' ? logTime : null, notes || null, existing.id);
          } else {
            db.prepare(`
              INSERT INTO medication_logs (id, user_id, medication_id, scheduled_time, actual_time, status, date, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(uuidv4(), userId, medicationId, scheduledTime, status === 'taken' ? logTime : null, status, logDate, notes || null);
          }
          results.push({ clientActionId: item.id, status: 'synced', type });
        } else if (type === 'GAME_SESSION') {
          const { gameType, domain, score, maxScore, levelReached, durationSeconds, reactionTimeMs, errorsCount } = payload;
          const sessionId = uuidv4();
          db.prepare(`
            INSERT INTO game_sessions (
              id, user_id, game_type, domain, score, max_score, level_reached,
              duration_seconds, reaction_time_ms, errors_count, completion_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')
          `).run(sessionId, userId, gameType, domain, score, maxScore || 100, levelReached || 1, durationSeconds || 60, reactionTimeMs || 450, errorsCount || 0);

          results.push({ clientActionId: item.id, status: 'synced', type });
        } else if (type === 'ASHA_VISIT') {
          const { ashaRecordId, visitDate, bpSystolic, bpDiastolic, bloodSugar, cognitiveScore, adherenceObserved, clinicalNotes, redFlags, nextVisitDate } = payload;
          const visitId = uuidv4();
          db.prepare(`
            INSERT INTO asha_visits (
              id, asha_record_id, visit_date, bp_systolic, bp_diastolic, blood_sugar,
              cognitive_score, adherence_observed, clinical_notes, red_flags, next_visit_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(visitId, ashaRecordId, visitDate || new Date().toISOString().split('T')[0], bpSystolic, bpDiastolic, bloodSugar, cognitiveScore, adherenceObserved, clinicalNotes, redFlags, nextVisitDate);

          results.push({ clientActionId: item.id, status: 'synced', type });
        } else {
          results.push({ clientActionId: item.id, status: 'ignored_unknown_type', type });
        }
      } catch (err: any) {
        results.push({ clientActionId: item.id, status: 'error', error: err.message });
      }
    }
  });

  try {
    syncTransaction(actions);
    res.json({
      message: 'Batch sync complete',
      totalReceived: actions.length,
      results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Batch sync transaction failed' });
  }
});

export default router;
