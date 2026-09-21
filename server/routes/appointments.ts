import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get appointments for current user (or for doctor if clinician role)
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let appointments: any[] = [];

    if (userRole === 'clinician') {
      // Find doctor record matching user or return all for clinician view
      appointments = db.prepare(`
        SELECT a.id, a.user_id as userId, a.doctor_id as doctorId, a.appointment_date as appointmentDate,
               a.appointment_time as appointmentTime, a.status, a.reason, a.consultation_type as consultationType,
               a.clinical_notes as clinicalNotes, a.prescription, a.created_at as createdAt,
               u.full_name as patientName, u.phone as patientPhone, u.email as patientEmail,
               d.name as doctorName, d.specialization as doctorSpecialization, d.hospital, d.image_url as doctorImage
        FROM appointments a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `).all() as any[];
    } else {
      appointments = db.prepare(`
        SELECT a.id, a.user_id as userId, a.doctor_id as doctorId, a.appointment_date as appointmentDate,
               a.appointment_time as appointmentTime, a.status, a.reason, a.consultation_type as consultationType,
               a.clinical_notes as clinicalNotes, a.prescription, a.created_at as createdAt,
               d.name as doctorName, d.specialization as doctorSpecialization, d.hospital, d.location,
               d.consultation_fee as consultationFee, d.image_url as doctorImage
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `).all(userId) as any[];
    }

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
  }
});

// Book a new appointment
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason = 'Routine Dementia & Cognitive Health Review',
      consultationType = 'video',
    } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      res.status(400).json({ error: 'Doctor ID, appointment date, and appointment time are required' });
      return;
    }

    const doctor = db.prepare('SELECT id, name FROM doctors WHERE id = ?').get(doctorId) as any;
    if (!doctor) {
      res.status(404).json({ error: 'Selected doctor not found' });
      return;
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO appointments (id, user_id, doctor_id, appointment_date, appointment_time, status, reason, consultation_type)
      VALUES (?, ?, ?, ?, ?, 'scheduled', ?, ?)
    `).run(id, userId, doctorId, appointmentDate, appointmentTime, reason, consultationType);

    // Also create a notification for the patient
    const notifId = uuidv4();
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read)
      VALUES (?, ?, ?, ?, 'appointment', 0)
    `).run(
      notifId,
      userId,
      'Appointment Confirmed',
      `Your ${consultationType} consultation with ${doctor.name} is scheduled for ${appointmentDate} at ${appointmentTime}.`
    );

    const created = db.prepare(`
      SELECT a.*, d.name as doctorName, d.specialization as doctorSpecialization, d.hospital, d.image_url as doctorImage
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(id);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: created,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to book appointment' });
  }
});

// Update appointment status / clinical notes (for clinician or patient cancelling)
router.put('/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, clinicalNotes, prescription } = req.body;

    const apt = db.prepare('SELECT id, user_id FROM appointments WHERE id = ?').get(id) as any;
    if (!apt) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    db.prepare(`
      UPDATE appointments
      SET status = COALESCE(?, status),
          clinical_notes = COALESCE(?, clinical_notes),
          prescription = COALESCE(?, prescription),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, clinicalNotes, prescription, id);

    res.json({ message: 'Appointment updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update appointment' });
  }
});

export default router;
