import { Router } from 'express';
import { MonitorController } from '../controllers/monitor.controller';

const router = Router();
const controller = new MonitorController();

// Start monitoring an address
router.post('/start', controller.startMonitoring);

// Stop monitoring an address
router.post('/stop', controller.stopMonitoring);

// Get monitoring status
router.get('/status/:address', controller.getStatus);

// Get monitoring logs
router.get('/logs/:address', controller.getLogs);

export default router;
