import { Request, Response } from 'express';
import { SolanaForensicAnalyzer } from '../services/analyzer.service';

export class AnalysisController {
  private getApiKey(): string {
    const apiKey = process.env.HELIUS_API_KEY || '';
    if (!apiKey) {
      throw new Error('HELIUS_API_KEY not configured');
    }
    return apiKey;
  }

  trace = async (req: Request, res: Response): Promise<void> => {
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

      const analyzer = new SolanaForensicAnalyzer(this.getApiKey(), address);
      const result = await analyzer.runTrace();

      res.json({
        success: true,
        data: result,
        message: 'Trace analysis completed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to perform trace analysis'
      });
    }
  };

  audit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address, depth = 3 } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the request body'
        });
        return;
      }

      if (depth < 1 || depth > 5) {
        res.status(400).json({
          success: false,
          error: 'Invalid depth',
          message: 'Depth must be between 1 and 5'
        });
        return;
      }

      const analyzer = new SolanaForensicAnalyzer(this.getApiKey(), address);
      const result = await analyzer.runAudit(depth);

      res.json({
        success: true,
        data: result,
        message: 'Audit analysis completed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to perform audit analysis'
      });
    }
  };

  forensic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address, depth = 3 } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the request body'
        });
        return;
      }

      if (depth < 1 || depth > 5) {
        res.status(400).json({
          success: false,
          error: 'Invalid depth',
          message: 'Depth must be between 1 and 5'
        });
        return;
      }

      const analyzer = new SolanaForensicAnalyzer(this.getApiKey(), address);
      const result = await analyzer.runForensic(depth);

      res.json({
        success: true,
        data: result,
        message: 'Forensic analysis completed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to perform forensic analysis'
      });
    }
  };

  all = async (req: Request, res: Response): Promise<void> => {
    try {
      const { address, depth = 3 } = req.body;

      if (!address) {
        res.status(400).json({
          success: false,
          error: 'Address is required',
          message: 'Please provide a Solana address in the request body'
        });
        return;
      }

      if (depth < 1 || depth > 5) {
        res.status(400).json({
          success: false,
          error: 'Invalid depth',
          message: 'Depth must be between 1 and 5'
        });
        return;
      }

      const analyzer = new SolanaForensicAnalyzer(this.getApiKey(), address);
      
      const trace = await analyzer.runTrace();
      const audit = await analyzer.runAudit(depth);
      const forensic = await analyzer.runForensic(depth);

      res.json({
        success: true,
        data: {
          trace,
          audit,
          forensic
        },
        message: 'All analyses completed successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Failed to perform complete analysis'
      });
    }
  };
}
