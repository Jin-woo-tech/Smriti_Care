import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.resolve(process.cwd(), 'smriti_care.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency and performance
db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('patient', 'caregiver', 'clinician', 'asha')),
      full_name TEXT NOT NULL,
      date_of_birth TEXT,
      phone TEXT,
      preferred_language TEXT DEFAULT 'en' CHECK(preferred_language IN ('en', 'hi')),
      address TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      age INTEGER,
      gender TEXT CHECK(gender IN ('M', 'F', 'Other')),
      location TEXT,
      condition TEXT,
      notes TEXT,
      avatar_initials TEXT,
      avatar_color TEXT,
      high_contrast INTEGER DEFAULT 0,
      text_scale TEXT DEFAULT 'normal',
      reduced_motion INTEGER DEFAULT 0,
      voice_assistance INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      generic_name TEXT,
      dosage TEXT NOT NULL,
      dosage_hi TEXT,
      frequency TEXT NOT NULL,
      frequency_hi TEXT,
      times TEXT NOT NULL, -- JSON array of times e.g. ["08:00 AM", "08:00 PM"]
      duration TEXT,
      instructions TEXT,
      instructions_hi TEXT,
      notes TEXT,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medication_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      medication_id TEXT,
      scheduled_time TEXT NOT NULL,
      actual_time TEXT,
      status TEXT NOT NULL CHECK(status IN ('scheduled', 'taken', 'skipped', 'missed')),
      date TEXT NOT NULL, -- YYYY-MM-DD
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      game_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      accuracy REAL NOT NULL,
      reaction_time_ms INTEGER NOT NULL,
      difficulty_tier INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      domain TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cognitive_metrics (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      domain TEXT NOT NULL,
      score REAL NOT NULL,
      baseline_score REAL NOT NULL,
      status TEXT DEFAULT 'stable' CHECK(status IN ('stable', 'watch', 'review')),
      trend_direction TEXT DEFAULT 'stable' CHECK(trend_direction IN ('improving', 'stable', 'slight-decline')),
      last_tested_date TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_hi TEXT,
      specialty TEXT NOT NULL,
      specialty_hi TEXT,
      hospital TEXT NOT NULL,
      hospital_hi TEXT,
      phone TEXT,
      email TEXT,
      available_days TEXT NOT NULL, -- JSON array e.g. ["Mon", "Wed", "Fri"]
      available_time_slots TEXT NOT NULL, -- JSON array e.g. ["10:00 AM", "02:00 PM"]
      rating REAL DEFAULT 4.8,
      location TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      notes TEXT,
      doctor_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS caregiver_relationships (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      caregiver_id TEXT NOT NULL,
      status TEXT DEFAULT 'authorized' CHECK(status IN ('pending', 'authorized', 'revoked')),
      permissions TEXT DEFAULT '["view_meds", "view_cognitive", "receive_alerts"]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS asha_patient_records (
      id TEXT PRIMARY KEY,
      asha_user_id TEXT,
      name TEXT NOT NULL,
      name_hi TEXT,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      village TEXT NOT NULL,
      village_hi TEXT,
      phone TEXT,
      caregiver_name TEXT,
      caregiver_phone TEXT,
      last_visit_date TEXT,
      adherence_rate REAL DEFAULT 85.0,
      cognitive_status TEXT DEFAULT 'stable',
      medication_stock_days INTEGER DEFAULT 14,
      next_scheduled_visit TEXT,
      notes TEXT,
      notes_hi TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asha_user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS asha_visits (
      id TEXT PRIMARY KEY,
      asha_user_id TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      blood_pressure TEXT,
      blood_sugar TEXT,
      medication_stock_days INTEGER,
      adherence_status TEXT,
      notes TEXT,
      follow_up_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asha_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      title_hi TEXT,
      relation TEXT,
      relation_hi TEXT,
      description TEXT,
      description_hi TEXT,
      year TEXT,
      image_url TEXT,
      audio_url TEXT,
      voice_note_text TEXT,
      voice_note_text_hi TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lab_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_name TEXT NOT NULL,
      test_name_hi TEXT,
      patient_name TEXT,
      test_date TEXT,
      detected_values_json TEXT NOT NULL,
      plain_language_summary TEXT NOT NULL,
      plain_language_summary_hi TEXT,
      doctor_recommendation TEXT,
      doctor_recommendation_hi TEXT,
      file_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      message TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      title_hi TEXT,
      message TEXT NOT NULL,
      message_hi TEXT,
      is_read INTEGER DEFAULT 0,
      action_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const existingUsers = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (existingUsers.count > 0) {
    return; // Already seeded
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Password@123', salt);

  // 1. Seed Default Demo Users for all 4 roles
  const patientId = 'user_patient_demo';
  const caregiverId = 'user_caregiver_demo';
  const clinicianId = 'user_clinician_demo';
  const ashaId = 'user_asha_demo';

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password_hash, role, full_name, date_of_birth, phone, preferred_language, address, emergency_contact_name, emergency_contact_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    patientId,
    'bipin.elder',
    'bipin.patient@smriticare.local',
    passwordHash,
    'patient',
    'Bipin Gogoi',
    '1952-08-14',
    '+91 94350 12345',
    'en',
    'Titabor Town, Ward 3, Jorhat, Assam',
    'Priyanka Gogoi (Daughter)',
    '+91 98640 54321'
  );

  insertUser.run(
    caregiverId,
    'priyanka.care',
    'priyanka.caregiver@smriticare.local',
    passwordHash,
    'caregiver',
    'Priyanka Gogoi',
    '1984-05-20',
    '+91 98640 54321',
    'en',
    'Jorhat / Titabor, Assam',
    'Dr. Baruah (Primary Doctor)',
    '+91 94350 99887'
  );

  insertUser.run(
    clinicianId,
    'dr.baruah',
    'dr.baruah@smriticare.local',
    passwordHash,
    'clinician',
    'Dr. Hitesh Baruah',
    '1975-11-03',
    '+91 94350 99887',
    'en',
    'Community Health Centre, Titabor, Jorhat',
    'Hospital Emergency Desk',
    '+91 376 2300108'
  );

  insertUser.run(
    ashaId,
    'anita.asha',
    'anita.asha@smriticare.local',
    passwordHash,
    'asha',
    'Anita Saikia',
    '1989-02-17',
    '+91 94351 77665',
    'en',
    'Madhupur Village, Titabor Block, Jorhat',
    'CHC Health Supervisor',
    '+91 94350 11223'
  );

  // 2. Profiles
  const insertProfile = db.prepare(`
    INSERT INTO profiles (user_id, age, gender, location, condition, notes, avatar_initials, avatar_color, voice_assistance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProfile.run(patientId, 72, 'M', 'Titabor, Jorhat', 'Mild Hypertension, Type 2 Diabetes, Early Memory Screening Routine', 'Enjoys morning tea, gardening, and memory games.', 'BG', '#a855f7', 1);
  insertProfile.run(caregiverId, 42, 'F', 'Titabor, Jorhat', 'Family Caregiver', 'Daughter caring for Bipin Gogoi.', 'PG', '#ec4899', 1);
  insertProfile.run(clinicianId, 50, 'M', 'Titabor CHC', 'MD Geriatric Medicine & General Practitioner', 'Lead Physician at Titabor Sub-divisional Hospital.', 'HB', '#3b82f6', 1);
  insertProfile.run(ashaId, 36, 'F', 'Madhupur Sector', 'ASHA Community Health Worker (Block 4)', 'Serving 45 elderly residents across 3 villages.', 'AS', '#10b981', 1);

  // 3. Medications for Bipin
  const insertMed = db.prepare(`
    INSERT INTO medications (id, user_id, name, generic_name, dosage, dosage_hi, frequency, frequency_hi, times, duration, instructions, instructions_hi, notes, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const med1Id = uuidv4();
  const med2Id = uuidv4();
  const med3Id = uuidv4();

  insertMed.run(
    med1Id,
    patientId,
    'Telmisartan 40mg',
    'Telmisartan',
    '1 Tablet (40mg)',
    '1 गोली (40mg)',
    'Daily (Morning)',
    'रोजाना (सुबह)',
    JSON.stringify(['08:00 AM']),
    'Ongoing',
    'Take with warm water right after light morning breakfast.',
    'सुबह के हल्के नाश्ते के बाद गुनगुने पानी के साथ लें।',
    'Blood pressure management'
  );

  insertMed.run(
    med2Id,
    patientId,
    'Metformin 500mg',
    'Metformin Hydrochloride',
    '1 Tablet (500mg)',
    '1 गोली (500mg)',
    'Twice a Day (Morning & Evening)',
    'दिन में 2 बार (सुबह और शाम)',
    JSON.stringify(['08:30 AM', '08:30 PM']),
    'Ongoing',
    'Take immediately after morning and evening meals.',
    'सुबह और शाम के भोजन के तुरंत बाद लें।',
    'Blood sugar / diabetes management'
  );

  insertMed.run(
    med3Id,
    patientId,
    'Vitamin B-Complex & D3',
    'Multivitamins with Cholecalciferol',
    '1 Capsule',
    '1 कैप्सूल',
    'Daily (Noon)',
    'रोजाना (दोपहर)',
    JSON.stringify(['01:00 PM']),
    '3 Months',
    'Take after lunch with plain water.',
    'दोपहर के भोजन के बाद पानी से लें।',
    'Nerve and bone support'
  );

  // 4. Medication Logs for today & recent days
  const insertLog = db.prepare(`
    INSERT INTO medication_logs (id, user_id, medication_id, scheduled_time, actual_time, status, date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const todayStr = new Date().toISOString().split('T')[0];
  insertLog.run(uuidv4(), patientId, med1Id, '08:00 AM', '08:10 AM', 'taken', todayStr, 'Taken on time with breakfast');
  insertLog.run(uuidv4(), patientId, med2Id, '08:30 AM', '08:35 AM', 'taken', todayStr, 'Taken after morning meal');
  insertLog.run(uuidv4(), patientId, med3Id, '01:00 PM', null, 'scheduled', todayStr, 'Scheduled after lunch');
  insertLog.run(uuidv4(), patientId, med2Id, '08:30 PM', null, 'scheduled', todayStr, 'Scheduled with dinner');

  // 5. Seed Game Sessions & Cognitive Metrics
  const insertGameSession = db.prepare(`
    INSERT INTO game_sessions (id, user_id, game_id, score, max_score, accuracy, reaction_time_ms, difficulty_tier, duration_seconds, domain, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const domains = [
    { gameId: 'remember-match', score: 92, max: 100, acc: 92, rt: 1200, tier: 2, dur: 75, domain: 'Visual Memory' },
    { gameId: 'find-symbol', score: 88, max: 100, acc: 88, rt: 950, tier: 2, dur: 60, domain: 'Sustained Attention' },
    { gameId: 'follow-path', score: 85, max: 100, acc: 85, rt: 1400, tier: 1, dur: 90, domain: 'Visual-Spatial Planning' },
    { gameId: 'remember-routine', score: 95, max: 100, acc: 95, rt: 1100, tier: 2, dur: 55, domain: 'Executive Function' },
    { gameId: 'sequence-recall', score: 82, max: 100, acc: 82, rt: 1300, tier: 2, dur: 80, domain: 'Working Memory' },
    { gameId: 'local-memory', score: 96, max: 100, acc: 96, rt: 890, tier: 1, dur: 45, domain: 'Visual Memory' },
  ];

  domains.forEach(d => {
    insertGameSession.run(uuidv4(), patientId, d.gameId, d.score, d.max, d.acc, d.rt, d.tier, d.dur, d.domain, new Date().toISOString());
  });

  const insertMetric = db.prepare(`
    INSERT INTO cognitive_metrics (id, user_id, domain, score, baseline_score, status, trend_direction, last_tested_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMetric.run(uuidv4(), patientId, 'Visual Memory', 94.0, 90.0, 'stable', 'improving', todayStr);
  insertMetric.run(uuidv4(), patientId, 'Sustained Attention', 88.0, 85.0, 'stable', 'stable', todayStr);
  insertMetric.run(uuidv4(), patientId, 'Visual-Spatial Planning', 85.0, 84.0, 'stable', 'stable', todayStr);
  insertMetric.run(uuidv4(), patientId, 'Executive Function', 95.0, 92.0, 'stable', 'improving', todayStr);
  insertMetric.run(uuidv4(), patientId, 'Working Memory', 82.0, 80.0, 'stable', 'stable', todayStr);

  // 6. Doctors Seed
  const insertDoctor = db.prepare(`
    INSERT INTO doctors (id, name, name_hi, specialty, specialty_hi, hospital, hospital_hi, phone, email, available_days, available_time_slots, rating, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const doc1Id = 'doc_baruah';
  const doc2Id = 'doc_sharma';
  const doc3Id = 'doc_kalita';

  insertDoctor.run(
    doc1Id,
    'Dr. Hitesh Baruah',
    'डॉ. हितेश बरुआ',
    'Geriatric Medicine & Neuro-Wellness',
    'वृद्धावस्था चिकित्सा एवं न्यूरो-वेलनेस',
    'Titabor Sub-divisional Civil Hospital',
    'तीताबर अनुमंडलीय सिविल अस्पताल',
    '+91 94350 99887',
    'dr.baruah@smriticare.local',
    JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
    JSON.stringify(['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM']),
    4.9,
    'Titabor, Jorhat'
  );

  insertDoctor.run(
    doc2Id,
    'Dr. Ananya Sharma',
    'डॉ. अनन्या शर्मा',
    'Neurologist & Cognitive Specialist',
    'न्यूरोलॉजिस्ट एवं संज्ञानात्मक विशेषज्ञ',
    'Jorhat Medical College & Hospital (JMCH)',
    'जोरहाट मेडिकल कॉलेज एवं अस्पताल',
    '+91 94352 33445',
    'dr.sharma@smriticare.local',
    JSON.stringify(['Tue', 'Thu', 'Sat']),
    JSON.stringify(['09:30 AM', '11:00 AM', '03:00 PM']),
    4.8,
    'Jorhat City'
  );

  insertDoctor.run(
    doc3Id,
    'Dr. Prabin Kalita',
    'डॉ. प्रबीन कलिता',
    'General Physician & Cardiologist',
    'जनरल फिजिशियन एवं हृदय रोग विशेषज्ञ',
    'Assam Medical Centre',
    'असम मेडिकल सेंटर',
    '+91 94354 55667',
    'dr.kalita@smriticare.local',
    JSON.stringify(['Mon', 'Wed', 'Fri', 'Sat']),
    JSON.stringify(['10:30 AM', '01:00 PM', '05:00 PM']),
    4.7,
    'Jorhat'
  );

  // 7. Seed Appointments
  const insertAppt = db.prepare(`
    INSERT INTO appointments (id, patient_id, doctor_id, date, time_slot, reason, status, notes, doctor_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAppt.run(
    uuidv4(),
    patientId,
    doc1Id,
    todayStr,
    '11:30 AM',
    'Monthly Routine BP, Sugar & Memory Review',
    'confirmed',
    'Carrying previous blood test reports.',
    'Review blood pressure logs and memory game baseline.'
  );

  // 8. Seed Caregiver Relationship
  const insertCareLink = db.prepare(`
    INSERT INTO caregiver_relationships (id, patient_id, caregiver_id, status, permissions)
    VALUES (?, ?, ?, 'authorized', '["view_meds", "view_cognitive", "receive_alerts", "edit_routine"]')
  `);
  insertCareLink.run(uuidv4(), patientId, caregiverId);

  // 9. Seed ASHA Records
  const insertAshaRec = db.prepare(`
    INSERT INTO asha_patient_records (id, asha_user_id, name, name_hi, age, gender, village, village_hi, phone, caregiver_name, caregiver_phone, last_visit_date, adherence_rate, cognitive_status, medication_stock_days, next_scheduled_visit, notes, notes_hi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAshaRec.run(
    uuidv4(),
    ashaId,
    'Bipin Gogoi',
    'बिपिन गोगोई',
    72,
    'M',
    'Madhupur Village, Ward 3',
    'मधुपुर गाँव, वार्ड 3',
    '+91 94350 12345',
    'Priyanka Gogoi',
    '+91 98640 54321',
    todayStr,
    94.5,
    'stable',
    18,
    '2026-10-05',
    'Patient is active and regular with morning memory exercises. Blood pressure normal.',
    'मरीज नियमित रूप से स्मृति अभ्यास कर रहे हैं। रक्तचाप सामान्य है।'
  );

  insertAshaRec.run(
    uuidv4(),
    ashaId,
    'Phuleswari Saikia',
    'फुलेश्वरी सैकिया',
    78,
    'F',
    'Madhupur Village, Ward 1',
    'मधुपुर गाँव, वार्ड 1',
    '+91 94351 98765',
    'Ramen Saikia (Son)',
    '+91 94352 11224',
    '2026-09-15',
    82.0,
    'watch',
    6,
    '2026-09-28',
    'Needs refill for blood pressure tablets next week. Mild forgetfulness observed.',
    'अगले सप्ताह रक्तचाप की दवाएं लानी होंगी। हल्का भूलने का लक्षण दिखा।'
  );

  // 10. Seed Memories
  const insertMemory = db.prepare(`
    INSERT INTO memories (id, user_id, title, title_hi, relation, relation_hi, description, description_hi, year, image_url, voice_note_text, voice_note_text_hi, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMemory.run(
    uuidv4(),
    patientId,
    'Family Pet Dog Bruno',
    'पारिवारिक पालतू कुत्ता ब्रूनो',
    'Beloved Pet Dog',
    'प्रिय पालतू कुत्ता',
    'Our playful Golden Retriever Bruno who loves morning garden walks and playing fetch.',
    'हमारा प्यारा गोल्डन रिट्रीवर कुत्ता ब्रूनो, जिसे सुबह बगीचे में टहलना और गेंद खेलना पसंद है।',
    '2025',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    'This is Bruno, your loyal Golden Retriever pet dog who greets you happily every morning.',
    'यह ब्रूनो है, आपका वफादार पालतू कुत्ता जो हर सुबह खुशी से आपका स्वागत करता है।',
    'pet,dog,bruno,family'
  );

  insertMemory.run(
    uuidv4(),
    patientId,
    'Majestic Royal Bengal Tiger',
    'रॉयल बंगाल टाइगर (सफारी)',
    'Wildlife Safari Encounter',
    'वन्यजीव सफारी अनुभव',
    'Memorable family safari sighting in Kaziranga National Park during a scenic morning jeep ride.',
    'काजीरंगा नेशनल पार्क में सुबह की जीप सफारी के दौरान यादगार वन्यजीव दर्शन।',
    '2024',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
    'Remember the thrilling Kaziranga safari tour where you spotted this beautiful tiger near the lake.',
    'याद है वह रोमांचक काजीरंगा सफारी, जहां आपने झील के किनारे इस सुंदर बाघ को देखा था।',
    'nature,wildlife,tiger,safari'
  );

  // 11. Seed Lab Report
  const insertLab = db.prepare(`
    INSERT INTO lab_reports (id, user_id, test_name, test_name_hi, patient_name, test_date, detected_values_json, plain_language_summary, plain_language_summary_hi, doctor_recommendation, doctor_recommendation_hi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleFindings = [
    { parameter: 'HbA1c (Glycated Hemoglobin)', parameterHi: 'एचबीए1सी (ग्लाइकेटेड हीमोग्लोबिन)', value: '6.7%', referenceRange: '< 5.7% (Diabetic: < 7.0%)', status: 'normal', explanation: 'Good diabetes control over the last 3 months.', explanationHi: 'पिछले 3 महीनों में शुगर का स्तर सुरक्षित सीमा में है।' },
    { parameter: 'Fasting Blood Sugar', parameterHi: 'खाली पेट शुगर (फास्टिंग)', value: '118 mg/dL', referenceRange: '70 - 100 mg/dL', status: 'elevated', explanation: 'Slightly higher than normal fasting range.', explanationHi: 'खाली पेट का शुगर सामान्य से थोड़ा सा बढ़ा हुआ है।' },
    { parameter: 'Serum Creatinine', parameterHi: 'सीरम क्रिएटिनिन', value: '0.95 mg/dL', referenceRange: '0.7 - 1.2 mg/dL', status: 'normal', explanation: 'Healthy kidney function.', explanationHi: 'गुर्दे (किडनी) की कार्यप्रणाली पूरी तरह स्वस्थ है।' },
    { parameter: 'Vitamin B12', parameterHi: 'विटामिन बी-12', value: '420 pg/mL', referenceRange: '200 - 900 pg/mL', status: 'normal', explanation: 'Adequate vitamin B12 supporting nerve health.', explanationHi: 'तंत्रिका स्वास्थ्य के लिए विटामिन बी-12 का स्तर उपयुक्त है।' },
  ];

  insertLab.run(
    uuidv4(),
    patientId,
    'Comprehensive Metabolic & Glycemic Profile',
    'व्यापक मेटाबॉलिक और मधुमेह रक्त परीक्षण',
    'Bipin Gogoi',
    todayStr,
    JSON.stringify(sampleFindings),
    'Your overall test results are reassuring! Diabetes management is stable with HbA1c at 6.7%. Kidney function and Vitamin B12 are in healthy ranges.',
    'आपकी रक्त जांच रिपोर्ट संतोषजनक है! तीन महीने का औसत शुगर स्तर 6.7% के साथ स्थिर है और किडनी कार्यप्रणाली पूरी तरह सामान्य है।',
    'Continue morning Metformin as prescribed, drink 8 glasses of water daily, and maintain regular morning walks.',
    'दवा का नियमित सेवन जारी रखें, प्रतिदिन 8 गिलास पानी पिएं और सुबह की सैर जारी रखें।'
  );

  // 12. Seed Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, title_hi, message, message_hi, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `);

  insertNotif.run(
    uuidv4(),
    patientId,
    'medicine',
    'Morning Medicine Time',
    'सुबह की दवा का समय',
    'Please take Telmisartan (40mg) with your morning breakfast.',
    'कृपया सुबह के नाश्ते के साथ टेलमीसार्टन (40mg) लें।',
  );

  insertNotif.run(
    uuidv4(),
    patientId,
    'appointment',
    'Upcoming Consultation Today',
    'आज का डॉक्टर परामर्श',
    'Dr. Hitesh Baruah consultation scheduled at 11:30 AM.',
    'डॉ. हितेश बरुआ के साथ 11:30 बजे परामर्श निर्धारित है।'
  );
}

// Automatically initialize SQLite tables and seed data upon module load
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database schema:', error);
}
