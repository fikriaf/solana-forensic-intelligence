# API Testing Guide

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Solana Forensic Intelligence API is running"
}
```

### 2. API Information
```bash
GET /
```

**Response:**
```json
{
  "name": "Solana Forensic Intelligence Platform",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "analysis": {
      "trace": "POST /api/analysis/trace",
      "audit": "POST /api/analysis/audit",
      "forensic": "POST /api/analysis/forensic",
      "all": "POST /api/analysis/all"
    },
    "monitor": {
      "start": "POST /api/monitor/start",
      "stop": "POST /api/monitor/stop",
      "status": "GET /api/monitor/status/:address",
      "logs": "GET /api/monitor/logs/:address"
    }
  }
}
```

---

## Analysis Endpoints

### 3. Quick Address Trace
```bash
POST /api/analysis/trace
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "targetAddress": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "totalReceived": 26.104548391,
    "totalSent": 10924.900342640,
    "netFlow": -10898.795794249,
    "transactionCount": 655,
    "counterpartiesCount": 42,
    "firstSeen": "2026-01-15T10:30:00.000Z",
    "lastSeen": "2026-02-16T13:05:44.000Z",
    "transactions": [...],
    "counterparties": [...]
  },
  "message": "Trace analysis completed successfully"
}
```

### 4. KYT/KYA Audit Report
```bash
POST /api/analysis/audit
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
  "depth": 3
}
```

**Parameters:**
- `address` (required): Solana wallet address
- `depth` (optional): Analysis depth (1-5, default: 3)

**Response:**
```json
{
  "success": true,
  "data": {
    "targetAddress": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "depth": 3,
    "flowsCount": 1250,
    "addressesCount": 47,
    "flows": [...],
    "addresses": [...],
    "clusters": [...]
  },
  "message": "Audit analysis completed successfully"
}
```

### 5. Forensic Visualization
```bash
POST /api/analysis/forensic
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
  "depth": 3
}
```

**Parameters:**
- `address` (required): Solana wallet address
- `depth` (optional): Analysis depth (1-5, default: 3)

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "edges": [...],
    "metadata": {
      "targetAddress": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
      "depth": 3,
      "totalNodes": 47,
      "totalEdges": 125,
      "totalVolume": 115779357959152743,
      "analysisDate": "2026-02-17T06:50:00.000Z"
    }
  },
  "message": "Forensic analysis completed successfully"
}
```

### 6. Complete Analysis (All-in-One)
```bash
POST /api/analysis/all
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
  "depth": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trace": {...},
    "audit": {...},
    "forensic": {...}
  },
  "message": "All analyses completed successfully"
}
```

---

## Monitor Endpoints

### 7. Start Monitoring
```bash
POST /api/monitor/start
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "monitoring_started",
    "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "subscriptionId": 12345,
    "startTime": "2026-02-17T06:50:00.000Z"
  },
  "message": "Monitoring started successfully"
}
```

### 8. Stop Monitoring
```bash
POST /api/monitor/stop
Content-Type: application/json

{
  "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "monitoring_stopped",
    "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "logsCount": 150,
    "duration": 3600000
  },
  "message": "Monitoring stopped successfully"
}
```

### 9. Get Monitoring Status
```bash
GET /api/monitor/status/Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "monitoring",
    "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "subscriptionId": 12345,
    "startTime": "2026-02-17T06:50:00.000Z",
    "logsCount": 150,
    "lastUpdate": "2026-02-17T07:50:00.000Z"
  },
  "message": "Status retrieved successfully"
}
```

### 10. Get Monitoring Logs
```bash
GET /api/monitor/logs/Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of recent logs to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
    "logs": [
      {
        "timestamp": "2026-02-17T07:50:00.000Z",
        "address": "Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21",
        "slot": 250000000,
        "lamports": 26104548391,
        "lamportsChange": 1000000000,
        "owner": "11111111111111111111111111111111",
        "executable": false
      }
    ],
    "total": 150
  },
  "message": "Logs retrieved successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Address is required",
  "message": "Please provide a Solana address in the request body"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "HELIUS_API_KEY not configured",
  "message": "Failed to perform trace analysis"
}
```

---

## Testing with cURL (Windows PowerShell)

### Test Health Check
```powershell
curl -UseBasicParsing http://localhost:3000/health
```

### Test Trace Analysis
```powershell
$body = @{address="Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"} | ConvertTo-Json
curl -UseBasicParsing -Method POST -Uri "http://localhost:3000/api/analysis/trace" -ContentType "application/json" -Body $body
```

### Test Audit Analysis
```powershell
$body = @{address="Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"; depth=3} | ConvertTo-Json
curl -UseBasicParsing -Method POST -Uri "http://localhost:3000/api/analysis/audit" -ContentType "application/json" -Body $body
```

### Test Forensic Analysis
```powershell
$body = @{address="Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"; depth=3} | ConvertTo-Json
curl -UseBasicParsing -Method POST -Uri "http://localhost:3000/api/analysis/forensic" -ContentType "application/json" -Body $body
```

### Test Start Monitoring
```powershell
$body = @{address="Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"} | ConvertTo-Json
curl -UseBasicParsing -Method POST -Uri "http://localhost:3000/api/monitor/start" -ContentType "application/json" -Body $body
```

### Test Get Status
```powershell
curl -UseBasicParsing "http://localhost:3000/api/monitor/status/Foym8s46ib3VGRckSWijmQKb9UfcRfuhQqMvHpmN1w21"
```

---

## Notes

- All POST endpoints require `Content-Type: application/json` header
- Analysis depth should be between 1-5 (recommended: 2-3 for quick analysis, 4-5 for deep investigation)
- Monitoring runs in real-time via WebSocket and saves logs automatically
- All analysis results are also saved to the `data/` directory
