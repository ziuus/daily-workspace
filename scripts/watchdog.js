#!/usr/bin/env node
// Real system watchdog — checks actual system + workspace health.
// No fake output: every line is derived from live measurements.
'use strict';

const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const DB_PATH = path.join(os.homedir(), '.daily', 'data', 'daily.db');
const PORT = 3456;

function memInfo() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    usedPct: Math.round((used / total) * 100),
    usedGb: (used / 1024 ** 3).toFixed(1),
    totalGb: (total / 1024 ** 3).toFixed(1),
  };
}

function diskInfo() {
  try {
    // statfs works on Linux/macOS; fall back to stat on error
    const st = fs.statfsSync(DB_PATH);
    const total = st.blocks * st.bsize;
    const free = st.bfree * st.bsize;
    return {
      freeGb: (free / 1024 ** 3).toFixed(1),
      totalGb: (total / 1024 ** 3).toFixed(1),
      freePct: Math.round((free / total) * 100),
    };
  } catch {
    return null;
  }
}

function dbInfo() {
  try {
    const size = fs.statSync(DB_PATH).size;
    const walExists = fs.existsSync(DB_PATH + '-wal');
    return { sizeKb: Math.round(size / 1024), wal: walExists ? 'WAL active' : 'checkpointed' };
  } catch (e) {
    return { error: e.message };
  }
}

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/api/stats`, { timeout: 3000 }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          resolve({ online: true, feed: j.updates?.total ?? '?', tasks: j.tasks?.total ?? '?' });
        } catch {
          resolve({ online: true, feed: '?', tasks: '?' });
        }
      });
    });
    req.on('error', () => resolve({ online: false }));
    req.on('timeout', () => { req.destroy(); resolve({ online: false }); });
  });
}

async function main() {
  const m = memInfo();
  const d = diskInfo();
  const db = dbInfo();
  const server = await checkServer();

  const lines = [];
  lines.push(`[WATCHDOG] ${new Date().toISOString()}`);
  lines.push(`[WATCHDOG] Memory: ${m.usedPct}% used (${m.usedGb}/${m.totalGb} GB)`);
  if (d) lines.push(`[WATCHDOG] Disk: ${d.freePct}% free (${d.freeGb}/${d.totalGb} GB on daily dir)`);
  lines.push(`[WATCHDOG] DB: ${db.sizeKb} KB, ${db.wal || db.error}`);
  lines.push(
    server.online
      ? `[WATCHDOG] Server: ONLINE :${PORT} (feed=${server.feed}, tasks=${server.tasks})`
      : `[WATCHDOG] Server: OFFLINE :${PORT} — daemon not responding`
  );

  const healthy = m.usedPct < 95 && (!d || d.freePct > 5) && !db.error && server.online;
  lines.push(healthy ? '[WATCHDOG] Health: NOMINAL' : '[WATCHDOG] Health: ATTENTION REQUIRED');

  console.log(lines.join('\n'));
  process.exit(healthy ? 0 : 1);
}

main().catch((e) => {
  console.error('[WATCHDOG] Failed:', e.message);
  process.exit(1);
});
