import { Request, Response } from 'express';
import { MonitorService } from '../services/monitor.service';

export class MonitorController {
  private monitorService: MonitorService;

  constructor() {
    this.monitorService = new MonitorService();
  }

  startMonitoring = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the request body'
        });
        return;
      }

      const result = await this.monitorService.startMonitoring(address);

      res.json({
        success: true,
        data: result,
        message: 'Monitoring started successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to start monitoring'
      });
    }
  };

  stopMonitoring = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the request body'
        });
        return;
      }

      const result = await this.monitorService.stopMonitoring(address);

      res.json({
        success: true,
        data: result,
        message: 'Monitoring stopped successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to stop monitoring'
      });
    }
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the URL'
        });
        return;
      }

      const status = this.monitorService.getStatus(address);

      res.json({
        success: true,
        data: status,
        message: 'Status retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to get monitoring status'
      });
    }
  };

  getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address } = req.params;
      const { limit } = req.query;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the URL'
        });
        return;
      }

      const logs = await this.monitorService.getLogs(address, limit ? parseInt(limit as string) : undefined);

      res.json({
        success: true,
        data: logs,
        message: 'Logs retrieved successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to get monitoring logs'
      });
    }
  };
}
