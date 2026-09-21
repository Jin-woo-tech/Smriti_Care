import { Router, Response } from 'express';
import { db } from '../db';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get all verified doctors
router.get('/', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { specialization, search } = req.query;

    let query = `
      SELECT id, name, specialization, qualification, experience_years as experienceYears,
             hospital, location, consultation_fee as consultationFee, available_days as availableDays,
             time_slots as timeSlots, languages, rating, review_count as reviewCount,
             image_url as imageUrl, bio
      FROM doctors
      WHERE 1=1
    `;
    const params: any[] = [];

    if (specialization) {
      query += ` AND specialization LIKE ?`;
      params.push(`%${specialization}%`);
    }

    if (search) {
      query += ` AND (name LIKE ? OR hospital LIKE ? OR location LIKE ? OR specialization LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY rating DESC`;

    const doctors = db.prepare(query).all(...params) as any[];

    const formatted = doctors.map(doc => ({
      ...doc,
      availableDays: typeof doc.availableDays === 'string' ? JSON.parse(doc.availableDays) : doc.availableDays,
      timeSlots: typeof doc.timeSlots === 'string' ? JSON.parse(doc.timeSlots) : doc.timeSlots,
      languages: typeof doc.languages === 'string' ? JSON.parse(doc.languages) : doc.languages,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch doctors' });
  }
});

// Get single doctor details
router.get('/:id', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const doc = db.prepare(`
      SELECT id, name, specialization, qualification, experience_years as experienceYears,
             hospital, location, consultation_fee as consultationFee, available_days as availableDays,
             time_slots as timeSlots, languages, rating, review_count as reviewCount,
             image_url as imageUrl, bio
      FROM doctors
      WHERE id = ?
    `).get(id) as any;

    if (!doc) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    res.json({
      ...doc,
      availableDays: typeof doc.availableDays === 'string' ? JSON.parse(doc.availableDays) : doc.availableDays,
      timeSlots: typeof doc.timeSlots === 'string' ? JSON.parse(doc.timeSlots) : doc.timeSlots,
      languages: typeof doc.languages === 'string' ? JSON.parse(doc.languages) : doc.languages,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch doctor details' });
  }
});

export default router;
