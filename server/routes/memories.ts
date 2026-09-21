import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get memories for user (or patient for caregiver)
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    let targetUserId = req.user?.id;
    const { patientId, tag } = req.query;

    if (patientId && (req.user?.role === 'caregiver' || req.user?.role === 'clinician')) {
      targetUserId = patientId as string;
    }

    let query = `
      SELECT id, user_id as userId, title, description, relationship, tag, media_url as mediaUrl,
             audio_url as audioUrl, memory_date as memoryDate, emotion, created_at as createdAt
      FROM memories
      WHERE user_id = ?
    `;
    const params: any[] = [targetUserId];

    if (tag) {
      query += ` AND tag = ?`;
      params.push(tag);
    }

    query += ` ORDER BY memory_date DESC`;

    const memories = db.prepare(query).all(...params);
    res.json(memories);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch memories' });
  }
});

// Add new memory
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      title,
      description,
      relationship,
      tag = 'family',
      mediaUrl,
      audioUrl,
      memoryDate = new Date().toISOString().split('T')[0],
      emotion = 'happy',
    } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO memories (id, user_id, title, description, relationship, tag, media_url, audio_url, memory_date, emotion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, title, description || null, relationship || null, tag, mediaUrl || null, audioUrl || null, memoryDate, emotion);

    const created = db.prepare('SELECT * FROM memories WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add memory' });
  }
});

// Delete memory
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    db.prepare('DELETE FROM memories WHERE id = ? AND user_id = ?').run(id, userId);
    res.json({ message: 'Memory deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete memory' });
  }
});

export default router;
