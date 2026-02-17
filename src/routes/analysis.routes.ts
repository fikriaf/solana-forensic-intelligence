import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = Router();
const controller = new AnalysisController();

// Trace endpoint - Quick address analysis
router.post('/trace', controller.trace);

// Audit endpoint - KYT/KYA audit report
router.post('/audit', controller.audit);

// Forensic endpoint - Full forensic visualization
router.post('/forensic', controller.forensic);

// All-in-one endpoint - Run all analyses
router.post('/all', controller.all);

export default router;
