import { HeliusService } from './helius.service';
import { WebSocketService } from './websocket.service';
import * as fs from 'fs';
import * as path from 'path';

interface MonitorLog {
  timestamp: string;
  address: string;
  slot: number;
  lamports: number;
  lamportsChange: number;
  owner: string;
  executable: boolean;
}

interface MonitorSession {
  address: string;
  ws: WebSocketService;
  subscriptionId: number;
  logs: MonitorLog[];
  previousLamports: number;
  startTime: string;
}

export class MonitorService {
  private sessions: Map<string, MonitorSession> = new Map();
  private helius: HeliusService | null = null;

  private getHelius(): HeliusService {
    if (!this.helius) {
      const apiKey = process.env.HELIUS_API_KEY || '';
      if (!apiKey) {
        throw new Error('HELIUS_API_KEY not configured');
      }
      this.helius = new HeliusService(apiKey);
    }
    return this.helius;
  }

  async startMonitoring(address: string): Promise<any> {
    if (this.sessions.has(address)) {
      return {
        status: 'already_monitoring',
        address,
        message: 'Address is already being monitored'
      };
    }

    const wsUrl = this.getHelius().getWebSocketUrl();
    const ws = new WebSocketService(wsUrl);

    await ws.connect();

    const subscriptionId = await ws.subscribeToAccount(
      address,
      (data) => this.handleAccountUpdate(address, data),
      {
        encoding: 'jsonParsed',
        commitment: 'confirmed'
      }
    );

    this.sessions.set(address, {
      address,
      ws,
      subscriptionId,
      logs: [],
      previousLamports: 0,
      startTime: new Date().toISOString()
    });

    return {
      status: 'monitoring_started',
      address,
      subscriptionId,
      startTime: new Date().toISOString()
    };
  }

  async stopMonitoring(address: string): Promise<any> {
    const session = this.sessions.get(address);

    if (!session) {
      return {
        status: 'not_monitoring',
        address,
        message: 'Address is not being monitored'
      };
    }

    await session.ws.unsubscribe(session.subscriptionId);
    session.ws.disconnect();

    // Save logs
    if (session.logs.length > 0) {
      this.saveLogs(address, session.logs);
    }

    this.sessions.delete(address);

    return {
      status: 'monitoring_stopped',
      address,
      logsCount: session.logs.length,
      duration: Date.now() - new Date(session.startTime).getTime()
    };
  }

  getStatus(address: string): any {
    const session = this.sessions.get(address);

    if (!session) {
      return {
        status: 'not_monitoring',
        address
      };
    }

    return {
      status: 'monitoring',
      address,
      subscriptionId: session.subscriptionId,
      startTime: session.startTime,
      logsCount: session.logs.length,
      lastUpdate: session.logs[session.logs.length - 1]?.timestamp
    };
  }

  async getLogs(address: string, limit?: number): Promise<any> {
    const session = this.sessions.get(address);

    if (session) {
      const logs = limit ? session.logs.slice(-limit) : session.logs;
      return {
        address,
        logs,
        total: session.logs.length
      };
    }

    // Try to load from file
    const outputDir = path.join(process.cwd(), 'data', 'monitor');
    const filename = `${address.substring(0, 20)}_monitor.json`;
    const filepath = path.join(outputDir, filename);

    if (fs.existsSync(filepath)) {
      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      const logs = limit ? data.logs.slice(-limit) : data.logs;
      return {
        address,
        logs,
        total: data.totalUpdates,
        fromFile: true
      };
    }

    return {
      address,
      logs: [],
      total: 0,
      message: 'No logs found'
    };
  }

  private handleAccountUpdate(address: string, data: any): void {
    const session = this.sessions.get(address);
    if (!session) return;

    try {
      const { context, value } = data.result;
      const timestamp = new Date().toISOString();

      const lamports = value.lamports || 0;
      const lamportsChange = session.previousLamports > 0 ? lamports - session.previousLamports : 0;
      session.previousLamports = lamports;

      const log: MonitorLog = {
        timestamp,
        address,
        slot: context.slot,
        lamports,
        lamportsChange,
        owner: value.owner || 'Unknown',
        executable: value.executable || false
      };

      session.logs.push(log);

      // Auto-save every 10 updates
      if (session.logs.length % 10 === 0) {
        this.saveLogs(address, session.logs);
      }
    } catch (error) {
      console.error('Error handling account update:', error);
    }
  }

  private saveLogs(address: string, logs: MonitorLog[]): void {
    const outputDir = path.join(process.cwd(), 'data', 'monitor');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${address.substring(0, 20)}_monitor.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify({
      address,
      startTime: logs[0]?.timestamp,
      lastUpdate: logs[logs.length - 1]?.timestamp,
      totalUpdates: logs.length,
      logs
    }, null, 2));
  }
}
