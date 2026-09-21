import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get cognitive metrics summary for radar charts and clinical analysis
router.get('/metrics', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician' || req.user?.role === 'asha')) {
      targetUserId = patientId as string;
    }

    const metrics = db.prepare(`
      SELECT domain, score, baseline_score as baselineScore, status, trend_direction as trendDirection,
             clinical_notes as clinicalNotes, last_tested_date as lastTestedDate
      FROM cognitive_metrics
      WHERE user_id = ?
    `).all(targetUserId) as any[];

    // Overall composite score calculation
    const avgScore = metrics.length > 0
      ? Math.round(metrics.reduce((acc, m) => acc + Number(m.score), 0) / metrics.length)
      : 82;

    res.json({
      overallScore: avgScore,
      metrics,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch cognitive metrics' });
  }
});

// Get game history
router.get('/history', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId, limit = 20 } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician' || req.user?.role === 'asha')) {
      targetUserId = patientId as string;
    }

    const history = db.prepare(`
      SELECT id, game_type as gameType, domain, score, max_score as maxScore, level_reached as levelReached,
             duration_seconds as durationSeconds, reaction_time_ms as reactionTimeMs, errors_count as errorsCount,
             completion_status as completionStatus, created_at as createdAt
      FROM game_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(targetUserId, Number(limit)) as any[];

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch game history' });
  }
});

// Submit a completed game session and dynamically adjust cognitive metric for domain
router.post('/sessions', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      gameType,
      domain,
      score,
      maxScore = 100,
      levelReached = 1,
      durationSeconds = 60,
      reactionTimeMs = 450,
      errorsCount = 0,
      completionStatus = 'completed',
    } = req.body;

    if (!gameType || !domain || score === undefined) {
      res.status(400).json({ error: 'gameType, domain, and score are required' });
      return;
    }

    const sessionId = uuidv4();
    db.prepare(`
      INSERT INTO game_sessions (
        id, user_id, game_type, domain, score, max_score, level_reached,
        duration_seconds, reaction_time_ms, errors_count, completion_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId,
      userId,
      gameType,
      domain,
      score,
      maxScore,
      levelReached,
      durationSeconds,
      reactionTimeMs,
      errorsCount,
      completionStatus
    );

    // Update cognitive_metrics for this domain
    const normalizedScore = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
    const todayStr = new Date().toISOString().split('T')[0];

    const existingMetric = db.prepare(`
      SELECT id, score, baseline_score FROM cognitive_metrics WHERE user_id = ? AND domain = ?
    `).get(userId, domain) as any;

    if (existingMetric) {
      // Exponential moving average for score update: (0.7 * old) + (0.3 * new)
      const newScore = Math.round(existingMetric.score * 0.7 + normalizedScore * 0.3);
      const diff = newScore - existingMetric.baseline_score;
      const trend = diff > 2 ? 'improving' : diff < -5 ? 'declining' : 'stable';
      const status = newScore >= 75 ? 'stable' : newScore >= 60 ? 'mild_concern' : 'requires_attention';

      db.prepare(`
        UPDATE cognitive_metrics
        SET score = ?, trend_direction = ?, status = ?, last_tested_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newScore, trend, status, todayStr, existingMetric.id);
    } else {
      db.prepare(`
        INSERT INTO cognitive_metrics (id, user_id, domain, score, baseline_score, status, trend_direction, last_tested_date)
        VALUES (?, ?, ?, ?, ?, 'stable', 'stable', ?)
      `).run(uuidv4(), userId, domain, normalizedScore, normalizedScore, todayStr);
    }

    res.status(201).json({
      message: 'Game session recorded and cognitive metrics updated',
      sessionId,
      domain,
      normalizedScore,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save game session' });
  }
});

export default router;
