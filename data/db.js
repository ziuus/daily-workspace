const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = process.env.DAILY_DB_PATH || path.join(process.env.HOME, '.daily', 'data', 'daily.db');

// Ensure parent folder exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Enable WAL mode for high concurrency
    try {
      dbInstance.exec('PRAGMA journal_mode = WAL;');
      dbInstance.exec('PRAGMA synchronous = NORMAL;');
    } catch (e) {
      // WAL might throw in some environments, ignore gracefully
    }
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- os_project, ai_tool, tech_news, custom
      markdown_content TEXT NOT NULL,
      tags TEXT, -- JSON array string
      source_agent TEXT DEFAULT 'hermes',
      metadata TEXT, -- JSON object string
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_status INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      command_or_prompt TEXT NOT NULL,
      schedule TEXT NOT NULL,
      status TEXT DEFAULT 'active', -- active, paused, error, running
      agent_type TEXT DEFAULT 'system', -- hermes, opencode, claude, system, cli
      last_run_at DATETIME,
      next_run_at DATETIME,
      last_output TEXT
    );

    CREATE TABLE IF NOT EXISTS task_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT NOT NULL,
      run_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL,
      output TEXT
    );
  `);

  // Column migration for agent_type
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN agent_type TEXT DEFAULT 'system';");
  } catch (e) {
    // Column already exists
  }

  // Check if updates is empty and seed initial data
  const countRow = db.prepare('SELECT COUNT(*) as count FROM updates').get();
  if (countRow.count === 0) {
    seedInitialData(db);
  }
}

function seedInitialData(db) {
  const now = new Date();
  const isoNow = now.toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const insertUpdate = db.prepare(`
    INSERT INTO updates (title, category, markdown_content, tags, source_agent, metadata, created_at, read_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialUpdates = [
    {
      title: "browser-use: Open-Source Web Automation Engine for LLM Agents",
      category: "os_project",
      markdown_content: `### 🚀 browser-use / browser-use

**browser-use** is exploding across GitHub with unprecedented velocity. It allows LLM agents to interact seamlessly with any website, automating forms, DOM traversal, interactive logins, and multi-step tasks using vision and Playwright.

#### Key Highlights & Architecture
- **Vision + DOM Hybrid**: Combines visual layout inspection with DOM element hashing for 99.4% click accuracy.
- **Multi-Agent Orchestration**: Supports concurrent browser sessions in isolated microVMs or local Playwright instances.
- **Zero-Config Agent Loop**: Pass any natural language goal (e.g. *"Log into Amazon, find top 3 mechanical keyboards under $50, and save to CSV"*).

#### Performance Metrics
| Metric | Value | Comparison |
| :--- | :--- | :--- |
| **Star Growth Velocity** | \`+1,420 stars/day\` | Top 0.01% GitHub Trending |
| **Primary Stack** | Python, TypeScript, Playwright | Cross-platform |
| **License** | MIT | Permissive Commercial |

> [!NOTE]
> Integrated with Hermes Agent ecosystem via Stdio MCP tool bridge.

\`\`\`python
from browser_use import Agent
from langchain_openai import ChatOpenAI

agent = Agent(
    task="Navigate to news.ycombinator.com, extract top 5 AI posts, summarize key points.",
    llm=ChatOpenAI(model="gpt-4o"),
)
await agent.run()
\`\`\`
`,
      tags: JSON.stringify(["python", "agent", "browser-automation", "playwright", "ai"]),
      source_agent: "hermes",
      metadata: JSON.stringify({
        repo_url: "https://github.com/browser-use/browser-use",
        star_growth: "+1,420 stars/day",
        language: "Python",
        stars: 28450
      }),
      created_at: isoNow,
      read_status: 0
    },
    {
      title: "Claude 3.7 Sonnet Hybrid Reasoning & Extended Thinking Released",
      category: "ai_tool",
      markdown_content: `### 🧠 Anthropic Claude 3.7 Sonnet: Dynamic Extended Thinking

Anthropic has officially released **Claude 3.7 Sonnet**, introducing a unified hybrid reasoning architecture that dynamically allocates cognitive budget based on query complexity.

#### Core Breakthroughs
- **Instant vs. Deep Reasoning Toggle**: Developers can control maximum budget tokens (from 1,024 up to 128,000 reasoning tokens).
- **State-of-the-Art Coding Benchmarks**: Scores **70.3%** on SWE-bench Verified, outperforming previous frontier models on complex multi-file refactoring.
- **Integrated Agentic Tooling**: Native support for computer use, file editing, bash execution, and parallel tool invocation.

> [!TIP]
> Use extended thinking mode for complex math, kernel driver debugging, and architecture design tasks.

#### Benchmark Comparison Table
| Benchmark | Claude 3.7 Sonnet (Reasoning) | Claude 3.5 Sonnet | DeepSeek R1 |
| :--- | :--- | :--- | :--- |
| **SWE-bench Verified** | **70.3%** | 49.2% | 49.2% |
| **TAU-bench (Telecom)** | **81.2%** | 68.7% | 62.4% |
| **AIME 2024 (Math)** | **80.0%** | 40.0% | 79.8% |

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const response = await anthropic.messages.create({
  model: 'claude-3-7-sonnet-20250219',
  max_tokens: 20000,
  thinking: {
    type: 'enabled',
    budget_tokens: 16000,
  },
  messages: [{ role: 'user', content: 'Audit this C++ memory manager for race conditions...' }],
});
\`\`\`
`,
      tags: JSON.stringify(["llm", "claude", "anthropic", "reasoning", "benchmark"]),
      source_agent: "hermes",
      metadata: JSON.stringify({
        vendor: "Anthropic",
        swe_bench: "70.3%",
        context_window: "200k"
      }),
      created_at: isoNow,
      read_status: 0
    },
    {
      title: "DeepSeek-R1 Open Weights Breakthrough & Local Inference Optimization",
      category: "ai_tool",
      markdown_content: `### ⚡ DeepSeek-R1: Open Frontier Reasoning Model

DeepSeek has open-sourced **DeepSeek-R1**, a 671B parameter Mixture-of-Experts (MoE) reasoning model trained using pure Reinforcement Learning (RL) without supervised fine-tuning warmstart.

#### Key Takeaways
1. **Local Distillations**: Released 1.5B, 7B, 14B, 32B, and 70B distilled versions based on Qwen and Llama architectures.
2. **Cost Efficiency**: Trained at a fraction of standard frontier model compute using custom FP8 FlashAttention kernels.
3. **vLLM Integration**: vLLM 0.7+ now supports native MLA (Multi-Head Latent Attention) acceleration for 3.4x faster tokens/sec on local RTX 4090 / A100 rigs.

> [!WARNING]
> Running the 671B model locally requires minimum 8x H100 or 16x RTX 4090 with GGUF IQ2_XS quantization.
`,
      tags: JSON.stringify(["deepseek", "open-source", "vllm", "local-ai", "quantization"]),
      source_agent: "hermes",
      metadata: JSON.stringify({
        license: "MIT",
        params: "671B MoE",
        distillations: ["1.5B", "7B", "14B", "32B", "70B"]
      }),
      created_at: yesterday,
      read_status: 1
    },
    {
      title: "Graphify: Turn Any Codebase into a Navigable Knowledge Graph",
      category: "os_project",
      markdown_content: `### 🕸️ graphify / graphify-cli

**Graphify** turns any directory of source files, documentation, or design specs into a navigable knowledge graph with community clustering and instant BFS/DFS query tools.

#### Key Features
- **AST-Based Parsing**: Fast structural parsing for JS/TS, Python, Go, Rust, and C/C++.
- **Clustered Communities**: Uses Louvain community detection to group sub-modules into high-level architectural concepts.
- **Zero API Cost Updates**: Incremental update algorithm refreshes the graph in <500ms when files change.

| Feature | Graphify | Standard Grep | Vector DB |
| :--- | :--- | :--- | :--- |
| **Relationship Traversal** | ✅ 2-hop / 3-hop call graphs | ❌ Line regex only | ❌ Semantic similarity only |
| **Deterministic** | ✅ 100% Exact | ⚠️ Text dependent | ❌ Stochastic embeddings |

\`\`\`bash
# Generate graphify output
graphify build . --out graphify-out/
# Query code relationships
graphify query "Who calls the authentication middleware?"
\`\`\`
`,
      tags: JSON.stringify(["knowledge-graph", "ast", "cli", "codebase-intelligence", "python"]),
      source_agent: "hermes",
      metadata: JSON.stringify({
        repo_url: "https://github.com/graphify/graphify",
        star_growth: "+820 stars/day",
        language: "Python",
        stars: 12400
      }),
      created_at: yesterday,
      read_status: 1
    },
    {
      title: "Node.js 22 LTS Native SQLite Module & Built-in WebSocket Client",
      category: "tech_news",
      markdown_content: `### 🟢 Node.js 22 LTS Feature Deep Dive

Node.js 22 LTS introduces major standard library improvements that eliminate external native C++ dependencies for many common server-side applications.

#### Key Additions
1. **\`node:sqlite\`**: Built-in synchronous SQLite database module (\`DatabaseSync\`) with WAL support and zero native compilation step.
2. **Native WebSocket Client**: Standard \`WebSocket\` browser-compatible global API without needing \`ws\` package.
3. **V8 Engine 12.4**: Maglev compiler enabled by default, delivering 15-20% execution speedup for CLI tools.
4. **Require ESM Modules**: Synchronous \`require()\` now supports ES modules seamlessly.

> [!NOTE]
> Used directly by **Daily** workspace backend for zero-dependency local SQLite storage.
`,
      tags: JSON.stringify(["nodejs", "javascript", "sqlite", "backend", "performance"]),
      source_agent: "hermes",
      metadata: JSON.stringify({
        version: "v22.23.1 LTS",
        v8_version: "12.4",
        source: "nodejs.org"
      }),
      created_at: twoDaysAgo,
      read_status: 1
    }
  ];

  for (const item of initialUpdates) {
    insertUpdate.run(
      item.title,
      item.category,
      item.markdown_content,
      item.tags,
      item.source_agent,
      item.metadata,
      item.created_at,
      item.read_status
    );
  }

  // Seed Autonomous Tasks with agent_type bindings
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, name, command_or_prompt, schedule, status, agent_type, last_run_at, next_run_at, last_output)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialTasks = [
    {
      id: "reddit-warmup",
      name: "Reddit Warmup Status Reporter",
      command_or_prompt: "python3 ~/.daily/scripts/reddit_warmup.py",
      schedule: "daily @ 09:00 IST",
      status: "active",
      agent_type: "hermes",
      last_run_at: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      next_run_at: new Date(now.getTime() + 20 * 3600 * 1000).toISOString(),
      last_output: "[WARMUP] Reads ~/.reddit-campaign/state.md"
    },
    {
      id: "ai-news-scraper",
      name: "Daily Tech & AI News Scraper",
      command_or_prompt: "node ~/.daily/scripts/ai_scraper.js",
      schedule: "every 6h",
      status: "active",
      agent_type: "system",
      last_run_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      next_run_at: new Date(now.getTime() + 4 * 3600 * 1000).toISOString(),
      last_output: "[SCRAPER] Fetches GitHub trending + HN"
    },
    {
      id: "system-watchdog",
      name: "Local Workspace & Server Health Monitor",
      command_or_prompt: "node ~/.daily/scripts/watchdog.js",
      schedule: "every 30m",
      status: "active",
      agent_type: "system",
      last_run_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      next_run_at: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      last_output: "[WATCHDOG] Reports real memory/disk/DB health"
    },
    {
      id: "repo-star-tracker",
      name: "Trending Open-Source Velocity Monitor",
      command_or_prompt: "node ~/.daily/scripts/repo_star_tracker.js",
      schedule: "daily @ 14:00 IST",
      status: "paused",
      agent_type: "system",
      last_run_at: new Date(now.getTime() - 28 * 3600 * 1000).toISOString(),
      next_run_at: null,
      last_output: "[PAUSED] Task manually paused by user."
    }
  ];

  for (const t of initialTasks) {
    insertTask.run(
      t.id,
      t.name,
      t.command_or_prompt,
      t.schedule,
      t.status,
      t.agent_type,
      t.last_run_at,
      t.next_run_at,
      t.last_output
    );
  }

  // Seed sample task logs
  const insertLog = db.prepare(`
    INSERT INTO task_logs (task_id, status, output) VALUES (?, ?, ?)
  `);
  insertLog.run("reddit-warmup", "success", "Warmup run OK at 09:00 IST. Karma delta: +42");
  insertLog.run("ai-news-scraper", "success", "Scraped GitHub Trending: browser-use, graphify");
  insertLog.run("system-watchdog", "success", "Watchdog check OK. All services nominal.");
}

// Data Access API Functions

function getUpdates({ since, category, search, limit = 50, tag, read_status } = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM updates WHERE 1=1';
  const params = [];

  if (since) {
    sql += ' AND created_at >= ?';
    params.push(since);
  }
  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (read_status !== undefined && read_status !== null) {
    sql += ' AND read_status = ?';
    params.push(Number(read_status));
  }
  if (search) {
    sql += ' AND (title LIKE ? OR markdown_content LIKE ? OR tags LIKE ?)';
    const query = `%${search}%`;
    params.push(query, query, query);
  }
  if (tag) {
    sql += ' AND tags LIKE ?';
    params.push(`%"${tag}"%`);
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  const stmt = db.prepare(sql);
  const rows = stmt.all(...params);
  return rows.map(formatUpdateRow);
}

function getUpdateById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM updates WHERE id = ?');
  const row = stmt.get(id);
  return row ? formatUpdateRow(row) : null;
}

function addUpdate({ title, category, markdown_content, tags = [], source_agent = 'hermes', metadata = {} }) {
  const db = getDb();
  const tagsJson = typeof tags === 'string' ? tags : JSON.stringify(tags || []);
  const metaJson = typeof metadata === 'string' ? metadata : JSON.stringify(metadata || {});

  const stmt = db.prepare(`
    INSERT INTO updates (title, category, markdown_content, tags, source_agent, metadata, created_at, read_status)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
  `);
  const res = stmt.run(title, category, markdown_content, tagsJson, source_agent, metaJson);
  return getUpdateById(res.lastInsertRowid);
}

function markUpdateRead(id, read_status = 1) {
  const db = getDb();
  const stmt = db.prepare('UPDATE updates SET read_status = ? WHERE id = ?');
  stmt.run(Number(read_status), id);
  return getUpdateById(id);
}

function deleteUpdate(id) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM updates WHERE id = ?');
  const res = stmt.run(id);
  return res.changes > 0;
}

function getTasks({ status } = {}) {
  const db = getDb();
  let sql = 'SELECT * FROM tasks';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY id ASC';
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

function getTaskById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
}

function addTask({ id, name, command_or_prompt, schedule, status = 'active', agent_type = 'system' }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO tasks (id, name, command_or_prompt, schedule, status, agent_type, last_run_at, next_run_at, last_output)
    VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, 'Task registered.')
  `);
  stmt.run(id, name, command_or_prompt, schedule, status, agent_type);
  return getTaskById(id);
}

function updateTask(id, fields = {}) {
  const db = getDb();
  const allowed = ['name', 'command_or_prompt', 'schedule', 'status', 'agent_type', 'last_run_at', 'next_run_at', 'last_output'];
  const sets = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (sets.length === 0) return getTaskById(id);

  params.push(id);
  const sql = `UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...params);
  return getTaskById(id);
}

function deleteTask(id) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const res = stmt.run(id);
  return res.changes > 0;
}

function logTaskExecution(task_id, status, output) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO task_logs (task_id, status, output) VALUES (?, ?, ?)');
  stmt.run(task_id, status, output);
}

function getTaskLogs(task_id, limit = 20) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM task_logs WHERE task_id = ? ORDER BY run_at DESC LIMIT ?');
  return stmt.all(task_id, Number(limit));
}

function getStats() {
  const db = getDb();
  const totalUpdates = db.prepare('SELECT COUNT(*) as count FROM updates').get().count;
  const unreadUpdates = db.prepare('SELECT COUNT(*) as count FROM updates WHERE read_status = 0').get().count;
  const osProjectsCount = db.prepare("SELECT COUNT(*) as count FROM updates WHERE category = 'os_project'").get().count;
  const aiToolsCount = db.prepare("SELECT COUNT(*) as count FROM updates WHERE category = 'ai_tool'").get().count;
  const techNewsCount = db.prepare("SELECT COUNT(*) as count FROM updates WHERE category = 'tech_news'").get().count;

  const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
  const activeTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'active'").get().count;
  const pausedTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'paused'").get().count;
  const errorTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'error'").get().count;

  return {
    updates: {
      total: totalUpdates,
      unread: unreadUpdates,
      categories: {
        os_project: osProjectsCount,
        ai_tool: aiToolsCount,
        tech_news: techNewsCount
      }
    },
    tasks: {
      total: totalTasks,
      active: activeTasks,
      paused: pausedTasks,
      error: errorTasks
    },
    system: {
      status: "nominal",
      mcp_status: "online",
      uptime_seconds: Math.floor(process.uptime()),
      db_path: DB_PATH
    }
  };
}

function formatUpdateRow(row) {
  return {
    ...row,
    tags: row.tags ? safeJsonParse(row.tags, []) : [],
    metadata: row.metadata ? safeJsonParse(row.metadata, {}) : {}
  };
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

module.exports = {
  getDb,
  getUpdates,
  getUpdateById,
  addUpdate,
  markUpdateRead,
  deleteUpdate,
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  logTaskExecution,
  getTaskLogs,
  getStats
};
