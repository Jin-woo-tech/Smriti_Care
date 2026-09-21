import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get lab reports for user
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician')) {
      targetUserId = patientId as string;
    }

    const reports = db.prepare(`
      SELECT id, user_id as userId, test_name as testName, test_date as testDate,
             summary, summary_hi as summaryHi, biomarkers, clinical_recommendations as clinicalRecommendations,
             file_url as fileUrl, created_at as createdAt
      FROM lab_reports
      WHERE user_id = ?
      ORDER BY test_date DESC
    `).all(targetUserId) as any[];

    const formatted = reports.map(r => ({
      ...r,
      biomarkers: typeof r.biomarkers === 'string' ? JSON.parse(r.biomarkers || '[]') : r.biomarkers,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch lab reports' });
  }
});

// Save lab report with parsed biomarkers and AI summary
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      testName,
      testDate = new Date().toISOString().split('T')[0],
      summary,
      summaryHi,
      biomarkers = [],
      clinicalRecommendations,
      fileUrl,
    } = req.body;

    if (!testName) {
      res.status(400).json({ error: 'Test name is required' });
      return;
    }

    const id = uuidv4();
    const biomarkersStr = JSON.stringify(biomarkers);

    db.prepare(`
      INSERT INTO lab_reports (
        id, user_id, test_name, test_date, summary, summary_hi,
        biomarkers, clinical_recommendations, file_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      testName,
      testDate,
      summary || 'Comprehensive lab biomarker screening',
      summaryHi || null,
      biomarkersStr,
      clinicalRecommendations || null,
      fileUrl || null
    );

    const created = db.prepare('SELECT * FROM lab_reports WHERE id = ?').get(id) as any;
    res.status(201).json({
      ...created,
      biomarkers: JSON.parse(created.biomarkers || '[]'),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to save lab report' });
  }
});

export default router;
