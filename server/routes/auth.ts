import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

// Register new user (Supports full onboarding payload)
router.post('/register', (req, res: Response): void => {
  try {
    const {
      username,
      email,
      password,
      role = 'patient',
      fullName,
      dateOfBirth,
      phone,
      preferredLanguage = 'en',
      address,
      emergencyContactName,
      emergencyContactPhone,
      // Optional profile setup data
      age,
      gender,
      condition,
      notes,
      avatarColor = '#a855f7',
      // Optional initial medications
      initialMedications,
    } = req.body;

    if (!fullName || (!username && !email) || !password) {
      res.status(400).json({ error: 'Full name, username/email, and password are required.' });
      return;
    }

    const effectiveUsername = username || (email ? email.split('@')[0] : `user_${Date.now()}`);

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR (email IS NOT NULL AND email = ?)').get(effectiveUsername, email || '') as { id: string } | undefined;
    if (existing) {
      res.status(409).json({ error: 'An account with this username or email already exists.' });
      return;
    }

    const userId = `user_${uuidv4().substring(0, 8)}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Insert user
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, role, full_name, date_of_birth, phone, preferred_language, address, emergency_contact_name, emergency_contact_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      effectiveUsername,
      email || null,
      passwordHash,
      role,
      fullName,
      dateOfBirth || null,
      phone || null,
      preferredLanguage,
      address || null,
      emergencyContactName || null,
      emergencyContactPhone || null
    );

    // Insert profile
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'SC';
    db.prepare(`
      INSERT INTO profiles (user_id, age, gender, location, condition, notes, avatar_initials, avatar_color, voice_assistance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      userId,
      age ? parseInt(age, 10) : null,
      gender || 'Other',
      address || 'Assam, India',
      condition || null,
      notes || null,
      initials,
      avatarColor
    );

    // If initial medications provided during setup
    if (Array.isArray(initialMedications) && initialMedications.length > 0) {
      const insertMed = db.prepare(`
        INSERT INTO medications (id, user_id, name, generic_name, dosage, frequency, times, duration, instructions, notes, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `);
      initialMedications.forEach((med: any) => {
        if (med.name && med.dosage) {
          insertMed.run(
            uuidv4(),
            userId,
            med.name,
            med.genericName || null,
            med.dosage,
            med.frequency || 'Daily',
            JSON.stringify(med.times || ['08:00 AM']),
            med.duration || 'Ongoing',
            med.instructions || null,
            med.notes || null
          );
        }
      });
    }

    // Default cognitive metrics baseline
    const insertMetric = db.prepare(`
      INSERT INTO cognitive_metrics (id, user_id, domain, score, baseline_score, status, trend_direction, last_tested_date)
      VALUES (?, ?, ?, ?, ?, 'stable', 'stable', ?)
    `);
    const todayStr = new Date().toISOString().split('T')[0];
    insertMetric.run(uuidv4(), userId, 'Visual Memory', 85.0, 85.0, todayStr);
    insertMetric.run(uuidv4(), userId, 'Sustained Attention', 85.0, 85.0, todayStr);
    insertMetric.run(uuidv4(), userId, 'Visual-Spatial Planning', 85.0, 85.0, todayStr);
    insertMetric.run(uuidv4(), userId, 'Executive Function', 85.0, 85.0, todayStr);
    insertMetric.run(uuidv4(), userId, 'Working Memory', 85.0, 85.0, todayStr);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        username: effectiveUsername,
        email,
        role,
        fullName,
        preferredLanguage,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userRecord = db.prepare('SELECT id, username, email, role, full_name as fullName, date_of_birth as dateOfBirth, phone, preferred_language as preferredLanguage, address, emergency_contact_name as emergencyContactName, emergency_contact_phone as emergencyContactPhone, created_at as createdAt FROM users WHERE id = ?').get(userId);
    const profileRecord = db.prepare('SELECT user_id as userId, age, gender, location, condition, notes, avatar_initials as avatarInitials, avatar_color as avatarColor, voice_assistance as voiceAssistance FROM profiles WHERE user_id = ?').get(userId);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        ...userRecord,
        profile: profileRecord,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', (req, res: Response): void => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(400).json({ error: 'Username/Email and password are required.' });
      return;
    }

    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(usernameOrEmail, usernameOrEmail) as any;

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      return;
    }

    const profileRecord = db.prepare('SELECT user_id as userId, age, gender, location, condition, notes, avatar_initials as avatarInitials, avatar_color as avatarColor, high_contrast as highContrast, text_scale as textScale, reduced_motion as reducedMotion, voice_assistance as voiceAssistance FROM profiles WHERE user_id = ?').get(user.id);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        preferredLanguage: user.preferred_language,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        dateOfBirth: user.date_of_birth,
        phone: user.phone,
        preferredLanguage: user.preferred_language,
        address: user.address,
        emergencyContactName: user.emergency_contact_name,
        emergencyContactPhone: user.emergency_contact_phone,
        createdAt: user.created_at,
        profile: profileRecord,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Get Current User Profile & Session
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const user = db.prepare(`
      SELECT id, username, email, role, full_name as fullName, date_of_birth as dateOfBirth, phone, preferred_language as preferredLanguage, address, emergency_contact_name as emergencyContactName, emergency_contact_phone as emergencyContactPhone, created_at as createdAt
      FROM users WHERE id = ?
    `).get(userId) as any;

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const profile = db.prepare(`
      SELECT user_id as userId, age, gender, location, condition, notes, avatar_initials as avatarInitials, avatar_color as avatarColor, high_contrast as highContrast, text_scale as textScale, reduced_motion as reducedMotion, voice_assistance as voiceAssistance
      FROM profiles WHERE user_id = ?
    `).get(userId);

    res.json({
      user: {
        ...user,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch user' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      fullName,
      phone,
      address,
      preferredLanguage,
      emergencyContactName,
      emergencyContactPhone,
      age,
      gender,
      condition,
      notes,
      avatarColor,
      highContrast,
      textScale,
      reducedMotion,
      voiceAssistance,
    } = req.body;

    if (fullName || phone || address || preferredLanguage || emergencyContactName || emergencyContactPhone) {
      db.prepare(`
        UPDATE users
        SET full_name = COALESCE(?, full_name),
            phone = COALESCE(?, phone),
            address = COALESCE(?, address),
            preferred_language = COALESCE(?, preferred_language),
            emergency_contact_name = COALESCE(?, emergency_contact_name),
            emergency_contact_phone = COALESCE(?, emergency_contact_phone),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(fullName, phone, address, preferredLanguage, emergencyContactName, emergencyContactPhone, userId);
    }

    db.prepare(`
      INSERT INTO profiles (user_id, age, gender, location, condition, notes, avatar_color, high_contrast, text_scale, reduced_motion, voice_assistance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        age = COALESCE(excluded.age, profiles.age),
        gender = COALESCE(excluded.gender, profiles.gender),
        location = COALESCE(excluded.location, profiles.location),
        condition = COALESCE(excluded.condition, profiles.condition),
        notes = COALESCE(excluded.notes, profiles.notes),
        avatar_color = COALESCE(excluded.avatar_color, profiles.avatar_color),
        high_contrast = COALESCE(excluded.high_contrast, profiles.high_contrast),
        text_scale = COALESCE(excluded.text_scale, profiles.text_scale),
        reduced_motion = COALESCE(excluded.reduced_motion, profiles.reduced_motion),
        voice_assistance = COALESCE(excluded.voice_assistance, profiles.voice_assistance)
    `).run(
      userId,
      age ? parseInt(age, 10) : null,
      gender || null,
      address || null,
      condition || null,
      notes || null,
      avatarColor || null,
      highContrast !== undefined ? (highContrast ? 1 : 0) : null,
      textScale || null,
      reducedMotion !== undefined ? (reducedMotion ? 1 : 0) : null,
      voiceAssistance !== undefined ? (voiceAssistance ? 1 : 0) : null
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Demo switch role endpoint
router.post('/demo-switch', (req, res: Response): void => {
  try {
    const { role } = req.body;
    let userId = 'user_patient_demo';
    if (role === 'caregiver') userId = 'user_caregiver_demo';
    if (role === 'clinician') userId = 'user_clinician_demo';
    if (role === 'asha') userId = 'user_asha_demo';

    const user = db.prepare(`
      SELECT id, username, email, role, full_name as fullName, date_of_birth as dateOfBirth, phone, preferred_language as preferredLanguage, address, emergency_contact_name as emergencyContactName, emergency_contact_phone as emergencyContactPhone, created_at as createdAt
      FROM users WHERE id = ?
    `).get(userId) as any;

    const profile = db.prepare(`
      SELECT user_id as userId, age, gender, location, condition, notes, avatar_initials as avatarInitials, avatar_color as avatarColor, voice_assistance as voiceAssistance
      FROM profiles WHERE user_id = ?
    `).get(userId);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        preferredLanguage: user.preferredLanguage,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        ...user,
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to switch demo role' });
  }
});

export default router;
