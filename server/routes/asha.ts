import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get ASHA registered patients
router.get('/patients', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const ashaId = req.user?.id;
    const { village, riskCategory } = req.query;

    let query = `
      SELECT id, asha_id as ashaId, patient_id as patientId, full_name as fullName, age, gender,
             village, district, abha_id as abhaId, phone, primary_caregiver_name as primaryCaregiverName,
             primary_caregiver_phone as primaryCaregiverPhone, cognitive_risk_category as cognitiveRiskCategory,
             last_visit_date as lastVisitDate, next_scheduled_visit as nextScheduledVisit,
             hypertension_status as hypertensionStatus, diabetes_status as diabetesStatus,
             notes, sync_status as syncStatus, created_at as createdAt
      FROM asha_patient_records
      WHERE 1=1
    `;
    const params: any[] = [];

    if (req.user?.role === 'asha') {
      query += ` AND (asha_id = ? OR asha_id IS NULL)`;
      params.push(ashaId);
    }

    if (village) {
      query += ` AND village LIKE ?`;
      params.push(`%${village}%`);
    }

    if (riskCategory) {
      query += ` AND cognitive_risk_category = ?`;
      params.push(riskCategory);
    }

    query += ` ORDER BY last_visit_date ASC`;

    const patients = db.prepare(query).all(...params);
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch ASHA patient records' });
  }
});

// Register a new patient in ASHA registry
router.post('/patients', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const ashaId = req.user?.id || 'user_asha_demo';
    const {
      fullName,
      age,
      gender,
      village,
      district = 'Kamrup Rural',
      abhaId,
      phone,
      primaryCaregiverName,
      primaryCaregiverPhone,
      cognitiveRiskCategory = 'low',
      hypertensionStatus = 0,
      diabetesStatus = 0,
      notes,
    } = req.body;

    if (!fullName || !village) {
      res.status(400).json({ error: 'Patient full name and village are required' });
      return;
    }

    const id = uuidv4();
    const todayStr = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO asha_patient_records (
        id, asha_id, full_name, age, gender, village, district, abha_id, phone,
        primary_caregiver_name, primary_caregiver_phone, cognitive_risk_category,
        last_visit_date, hypertension_status, diabetes_status, notes, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
    `).run(
      id,
      ashaId,
      fullName,
      age ? parseInt(age, 10) : null,
      gender || 'Other',
      village,
      district,
      abhaId || null,
      phone || null,
      primaryCaregiverName || null,
      primaryCaregiverPhone || null,
      cognitiveRiskCategory,
      todayStr,
      hypertensionStatus ? 1 : 0,
      diabetesStatus ? 1 : 0,
      notes || null
    );

    const created = db.prepare('SELECT * FROM asha_patient_records WHERE id = ?').get(id);
    res.status(201).json({
      message: 'Patient registered in ASHA community registry',
      patient: created,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to register ASHA patient' });
  }
});

// Get visits history
router.get('/visits', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { recordId } = req.query;
    let query = `
      SELECT v.id, v.asha_record_id as ashaRecordId, v.visit_date as visitDate, v.bp_systolic as bpSystolic,
             v.bp_diastolic as bpDiastolic, v.blood_sugar as bloodSugar, v.cognitive_score as cognitiveScore,
             v.adherence_observed as adherenceObserved, v.clinical_notes as clinicalNotes,
             v.red_flags as redFlags, v.next_visit_date as nextVisitDate,
             p.full_name as patientName, p.village
      FROM asha_visits v
      LEFT JOIN asha_patient_records p ON v.asha_record_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (recordId) {
      query += ` AND v.asha_record_id = ?`;
      params.push(recordId);
    }

    query += ` ORDER BY v.visit_date DESC`;

    const visits = db.prepare(query).all(...params);
    res.json(visits);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch visits' });
  }
});

// Record a new visit / health check
router.post('/visits', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      ashaRecordId,
      visitDate = new Date().toISOString().split('T')[0],
      bpSystolic,
      bpDiastolic,
      bloodSugar,
      cognitiveScore,
      adherenceObserved = 'Good (takes daily)',
      clinicalNotes,
      redFlags,
      nextVisitDate,
    } = req.body;

    if (!ashaRecordId) {
      res.status(400).json({ error: 'ashaRecordId is required' });
      return;
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO asha_visits (
        id, asha_record_id, visit_date, bp_systolic, bp_diastolic, blood_sugar,
        cognitive_score, adherence_observed, clinical_notes, red_flags, next_visit_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      ashaRecordId,
      visitDate,
      bpSystolic ? parseInt(bpSystolic, 10) : null,
      bpDiastolic ? parseInt(bpDiastolic, 10) : null,
      bloodSugar ? parseFloat(bloodSugar) : null,
      cognitiveScore ? parseFloat(cognitiveScore) : null,
      adherenceObserved,
      clinicalNotes || null,
      redFlags || null,
      nextVisitDate || null
    );

    // Update last visit date in patient record
    db.prepare(`
      UPDATE asha_patient_records
      SET last_visit_date = ?, next_scheduled_visit = COALESCE(?, next_scheduled_visit)
      WHERE id = ?
    `).run(visitDate, nextVisitDate || null, ashaRecordId);

    res.status(201).json({ message: 'Visit record logged successfully', visitId: id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to record visit' });
  }
});

export default router;
