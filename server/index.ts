import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import authRoutes from './routes/auth';
import medicationRoutes from './routes/medications';
import gameRoutes from './routes/games';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import caregiverRoutes from './routes/caregivers';
import ashaRoutes from './routes/asha';
import memoryRoutes from './routes/memories';
import labReportRoutes from './routes/labReports';
import syncRoutes from './routes/sync';
import aiRoutes from './routes/ai';

// Initialize environment
dotenv.config();

// Ensure SQLite tables & default seed records are initialized
initDatabase();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SmritiCare Unified Healthcare Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/asha', ashaRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/lab-reports', labReportRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================`);
  console.log(`   SmritiCare Healthcare Server Online       `);
  console.log(`   Listening on: http://localhost:${PORT}     `);
  console.log(`   API Endpoint: http://localhost:${PORT}/api `);
  console.log(`=============================================`);
});

export default app;
