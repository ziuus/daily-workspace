const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const url = require('node:url');

const db = require('../data/db.js');
const scheduler = require('./scheduler.js');

const PORT = process.env.DAILY_PORT || 3456;
const WEB_DIST = path.join(__dirname, '..', 'web', 'dist');

function startServer(port = PORT) {
  // Start autonomous task scheduler
  scheduler.startScheduler();

  const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    try {
      // REST API Routes
      if (pathname.startsWith('/api/')) {
        return handleApiRequest(req, res, pathname, query);
      }

      // Serve Static Web Frontend
      serveStaticWeb(req, res, pathname);
    } catch (err) {
      console.error('[API SERVER ERROR]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  server.listen(port, () => {
    console.log(`[DAILY SERVER] Running at http://localhost:${port}`);
  });

  return server;
}

async function handleApiRequest(req, res, pathname, query) {
  res.setHeader('Content-Type', 'application/json');

  // GET /api/stats
  if (req.method === 'GET' && pathname === '/api/stats') {
    const stats = db.getStats();
    res.writeHead(200);
    return res.end(JSON.stringify(stats));
  }

  // GET /api/updates
  if (req.method === 'GET' && pathname === '/api/updates') {
    const updates = db.getUpdates({
      since: query.since,
      category: query.category,
      search: query.search,
      limit: query.limit ? parseInt(query.limit, 10) : 50,
      tag: query.tag,
      read_status: query.read_status !== undefined ? parseInt(query.read_status, 10) : undefined
    });
    res.writeHead(200);
    return res.end(JSON.stringify(updates));
  }

  // GET /api/updates/:id
  const updateMatch = pathname.match(/^\/api\/updates\/(\d+)$/);
  if (req.method === 'GET' && updateMatch) {
    const item = db.getUpdateById(parseInt(updateMatch[1], 10));
    if (!item) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Update not found' }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify(item));
  }

  // POST /api/updates
  if (req.method === 'POST' && pathname === '/api/updates') {
    const body = await parseJsonBody(req);
    if (!body.title || !body.category || !body.markdown_content) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Missing required fields: title, category, markdown_content' }));
    }
    const created = db.addUpdate(body);
    res.writeHead(201);
    return res.end(JSON.stringify(created));
  }

  // PATCH /api/updates/:id/read
  const readMatch = pathname.match(/^\/api\/updates\/(\d+)\/read$/);
  if (req.method === 'PATCH' && readMatch) {
    const body = await parseJsonBody(req);
    const readStatus = body.read_status !== undefined ? body.read_status : 1;
    const updated = db.markUpdateRead(parseInt(readMatch[1], 10), readStatus);
    res.writeHead(200);
    return res.end(JSON.stringify(updated));
  }

  // DELETE /api/updates/:id
  if (req.method === 'DELETE' && updateMatch) {
    const deleted = db.deleteUpdate(parseInt(updateMatch[1], 10));
    res.writeHead(200);
    return res.end(JSON.stringify({ success: deleted }));
  }

  // GET /api/tasks
  if (req.method === 'GET' && pathname === '/api/tasks') {
    const tasks = db.getTasks({ status: query.status });
    res.writeHead(200);
    return res.end(JSON.stringify(tasks));
  }

  // GET /api/tasks/:id
  const taskMatch = pathname.match(/^\/api\/tasks\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'GET' && taskMatch) {
    const task = db.getTaskById(taskMatch[1]);
    if (!task) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Task not found' }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify(task));
  }

  // POST /api/tasks
  if (req.method === 'POST' && pathname === '/api/tasks') {
    const body = await parseJsonBody(req);
    if (!body.id || !body.name || !body.command_or_prompt || !body.schedule) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Missing required fields: id, name, command_or_prompt, schedule' }));
    }
    const created = db.addTask(body);
    res.writeHead(201);
    return res.end(JSON.stringify(created));
  }

  // PATCH /api/tasks/:id
  if (req.method === 'PATCH' && taskMatch) {
    const body = await parseJsonBody(req);
    const updated = db.updateTask(taskMatch[1], body);
    res.writeHead(200);
    return res.end(JSON.stringify(updated));
  }

  // POST /api/tasks/:id/trigger
  const triggerMatch = pathname.match(/^\/api\/tasks\/([a-zA-Z0-9_-]+)\/trigger$/);
  if (req.method === 'POST' && triggerMatch) {
    const result = await scheduler.runTask(triggerMatch[1]);
    res.writeHead(200);
    return res.end(JSON.stringify(result));
  }

  // GET /api/tasks/:id/logs
  const logsMatch = pathname.match(/^\/api\/tasks\/([a-zA-Z0-9_-]+)\/logs$/);
  if (req.method === 'GET' && logsMatch) {
    const logs = db.getTaskLogs(logsMatch[1], query.limit ? parseInt(query.limit, 10) : 20);
    res.writeHead(200);
    return res.end(JSON.stringify(logs));
  }

  // DELETE /api/tasks/:id
  if (req.method === 'DELETE' && taskMatch) {
    const deleted = db.deleteTask(taskMatch[1]);
    res.writeHead(200);
    return res.end(JSON.stringify({ success: deleted }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

function serveStaticWeb(req, res, pathname) {
  let filePath = path.join(WEB_DIST, pathname === '/' ? 'index.html' : pathname);

  // Fallback to index.html for SPA client-side routing if file doesn't exist
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(WEB_DIST, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Daily Web Interface not built yet. Run build step or start dev server.');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
