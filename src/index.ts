import express from 'express';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysis.routes';
import monitorRoutes from './routes/monitor.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Solana Forensic Intelligence API is running' });
});

// API routes
app.get('/', (req, res) => {
  res.json({
    name: 'Solana Forensic Intelligence Platform',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      analysis: {
        trace: 'POST /api/analysis/trace',
        audit: 'POST /api/analysis/audit',
        forensic: 'POST /api/analysis/forensic',
        all: 'POST /api/analysis/all'
      },
      monitor: {
        start: 'POST /api/monitor/start',
        stop: 'POST /api/monitor/stop',
        status: 'GET /api/monitor/status/:address',
        logs: 'GET /api/monitor/logs/:address'
      }
    }
  });
});

// Mount routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/monitor', monitorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Solana Forensic Intelligence Platform`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /health                          - Health check`);
  console.log(`  GET  /                                - API information`);
  console.log(`\n  Analysis Endpoints:`);
  console.log(`  POST /api/analysis/trace              - Quick address trace`);
  console.log(`  POST /api/analysis/audit              - KYT/KYA audit report`);
  console.log(`  POST /api/analysis/forensic           - Forensic visualization`);
  console.log(`  POST /api/analysis/all                - Run all analyses`);
  console.log(`\n  Monitor Endpoints:`);
  console.log(`  POST /api/monitor/start               - Start monitoring`);
  console.log(`  POST /api/monitor/stop                - Stop monitoring`);
  console.log(`  GET  /api/monitor/status/:address     - Get monitoring status`);
  console.log(`  GET  /api/monitor/logs/:address       - Get monitoring logs`);
});

