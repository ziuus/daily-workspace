<div align="center">

# ⚡ Daily
### Autonomous Workspace, Daily Intelligence Feed, Theme Studio & Task Management Dashboard

*A developer-first, high-density workspace and local background automation hub built for software engineers and AI agents.*

[![npm version](https://img.shields.io/npm/v/@ziuus/daily.svg?color=10B981&style=for-the-badge)](https://www.npmjs.com/package/@ziuus/daily)
[![License: MIT](https://img.shields.io/badge/License-MIT-38BDF8.svg?style=for-the-badge)](LICENSE)
[![MCP Server](https://img.shields.io/badge/MCP-Stdio%20Ready-A855F7.svg?style=for-the-badge)](mcp/index.js)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg?style=for-the-badge)](https://nodejs.org)

</div>

---

## 🖥️ Dashboard Interface Preview

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [D] DAILY WORKSPACE v1.1 • MCP: Online • Workers 3/3            [Search ⌘K] [🎨 Themes] [+New Entry]   │
├───────────────────────────┬────────────────────────────────────────────┬───────────────────────────────┤
│ FEED TIMELINE             │ READING CANVAS                             │ WORKSPACE METRICS             │
│                           │                                            │                               │
│ [OS REPO] browser-use     │ # browser-use: Web Automation Engine       │ ┌───────────────────────────┐ │
│ ⚡ +1,420 stars/day        │                                            │ │ OS Repos Tracked    5     │ │
│ 2m ago                    │ Explosive open-source browser automation   │ │ Active Cron Jobs    3/4   │ │
│                           │ framework for LLM agents.                  │ └───────────────────────────┘ │
│ [AI TOOL] Claude 3.7      │                                            │                               │
│ Hybrid Reasoning          │ ```python                                  │ AUTONOMOUS TASKS              │
│ 1h ago                    │ agent = Agent(task="Scrape news...")       │                               │
│                           │ await agent.run()                          │ ● reddit-warmup    [RUN NOW]  │
│ [NEWS] Node.js 22 LTS     │ ```                                        │ ● ai-news-scraper  [RUN NOW]  │
│ Native SQLite & WS        │                                            │ ◐ repo-star-track  [PAUSED]   │
│ 1d ago                    │ > [!NOTE] Native Stdio MCP Integration     │ ● system-watchdog  [RUN NOW]  │
└───────────────────────────┴────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 🌟 Key Features

* **📰 Curated Intelligence Feed**: Track shortlisted viral open-source repositories (velocity, star growth, repo links), trending AI tools & LLM releases, and high-signal tech news.
* **🎨 22-Theme Studio & Dynamic Workspace Engine**: 22 hand-curated color presets (11 Light / 11 Dark) that transform 100% of the workspace interface (headers, sidebars, badges, buttons, dots, and surfaces).
* **☀️/🌙 Paired Light & Dark Mode Toggling**: The Sun/Moon header button smoothly toggles between paired Light and Dark versions of your active theme family (e.g. *Rose Quartz* ↔ *Velvet Crimson Rose*).
* **🤖 Autonomous Task & Cron Hub**: Manage background scripts (Python scripts, scrapers, system health watchdogs). Monitor status (`active`, `paused`, `running`, `error`), last/next run times, and live terminal logs.
* **🔌 Built-in MCP Server (`daily-mcp`)**: Native Stdio Model Context Protocol integration enabling AI agents (Claude Desktop, Cursor, Antigravity/Gemini, Hermes, Windsurf, Roo Code, Goose) to push markdown updates, read feed entries, and trigger tasks on demand.
* **✍️ Rich GFM Markdown Renderer**: Built-in renderer with code syntax highlighting, copy-to-clipboard buttons, formatted tables, task checklists, and GFM callout blocks (`[!NOTE]`, `[!TIP]`, `[!WARNING]`).
* **📦 Zero-Dependency SQLite Storage**: Powered by Node.js native `node:sqlite` for high-performance WAL-mode storage in `~/.daily/data/daily.db`.

---

## 🚀 Quick Start

### Installation

Install globally via `npm`:

```bash
npm install -g @ziuus/daily
```

Or run instantly with `npx`:

```bash
npx @ziuus/daily
```

---

## 💻 Command Line Interface (CLI)

The `daily` binary provides full terminal control over feeds, tasks, background daemons, and MCP servers:

| Command | Description |
| :--- | :--- |
| `daily` | Launches/opens the Web Dashboard at `http://localhost:3456` in your default browser. |
| `daily start` | Starts the background daemon server on port `3456`. |
| `daily stop` | Gracefully stops the running background daemon server. |
| `daily restart` | Restarts the background daemon server and syncs the web assets. |
| `daily status` | Checks process status, PID, port, and health of the daemon server. |
| `daily list` | Prints formatted intelligence feed entries to the terminal. |
| `daily list --category os_project` | Filters terminal output by category (`os_project`, `ai_tool`, `tech_news`, `custom`). |
| `daily add [flags]` | Inserts a new markdown update entry directly from the CLI. |
| `daily task list` | Displays an ASCII status table of all registered autonomous background tasks. |
| `daily task trigger <id>` | Manually triggers immediate execution of task `<id>`. |
| `daily task pause <id>` | Pauses automatic cron execution for task `<id>`. |
| `daily task resume <id>` | Resumes automatic cron execution for task `<id>`. |
| `daily task add [flags]` | Registers a new autonomous cron script. |
| `daily serve` | Runs the REST API server and task scheduler in the foreground. |
| `daily mcp` | Launches the Stdio MCP Server for AI agents. |

### CLI Examples

```bash
# Start or restart background daemon
daily restart

# Check daemon health
daily status

# Add a new feed entry
daily add --title "DeepSeek-V3 Architecture Deep Dive" \
          --category ai_tool \
          --content "### DeepSeek-V3\nMulti-Head Latent Attention (MLA) breakdown." \
          --tags "deepseek,ai,architecture"

# Trigger a background script
daily task trigger reddit-warmup

# Register a custom cron script
daily task add --id "market-watchdog" \
               --name "Market Tracker Script" \
               --cmd "python3 ~/.daily/scripts/market.py" \
               --schedule "every 1h"
```

---

## 🤖 MCP Server Integration (`daily-mcp`)

**Daily** includes a built-in Stdio MCP Server so any AI agent can read feed entries, post new intelligence, list tasks, and trigger background execution.

### Configuration Snippets

#### 1. Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "daily": {
      "command": "npx",
      "args": ["-y", "@ziuus/daily", "mcp"]
    }
  }
}
```

#### 2. Cursor / Windsurf / Roo Code / VS Code (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "daily": {
      "command": "npx",
      "args": ["-y", "@ziuus/daily", "mcp"]
    }
  }
}
```

#### 3. Hermes Agent (`~/.hermes/config.yaml`)

```yaml
mcp_servers:
  daily:
    command: "npx"
    args:
      - "-y"
      - "@ziuus/daily"
      - "mcp"
```

#### 4. Goose CLI / Open-Source Agents

```bash
goose mcp add daily -- npx -y @ziuus/daily mcp
```

### Exposed MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `daily_add_update` | `title`, `category`, `markdown_content`, `tags`, `metadata` | Push a new markdown intelligence entry to the workspace feed. |
| `daily_get_updates` | `since`, `category`, `limit`, `read_status` | Fetch recorded updates between a given timestamp and now. |
| `daily_list_tasks` | `status_filter` | List all registered autonomous background tasks and status. |
| `daily_trigger_task` | `task_id` | Manually trigger immediate execution of a task. |

---

## 🎨 22-Theme Studio Presets

Click the **Themes 🎨** button in the header bar to choose from 22 hand-crafted color combinations:

| Category | Presets |
| :--- | :--- |
| **Light Themes (11)** | *Cream & Emerald (Original)*, *Rose Quartz*, *Vercel Blue Slate*, *Warm Clay & Amber*, *Nordic Sage*, *Lavender Haze*, *Terracotta Gold*, *High Tech Cyan*, *Pure Monochrome*, *Sahara Dune*, *Pacific Sky*. |
| **Dark Themes (11)** | *Emerald Studio Dark (Original)*, *Velvet Crimson Rose*, *Linear Indigo Graphite*, *Obsidian Amber Luxe*, *Pine Needle Forest*, *Cosmic Neon Purple*, *Dracula Gothic Pink*, *Neo Tokyo Cyberpunk*, *Pure Monokai Code*, *Retro 80s Synthwave*, *Midnight Abyss Cyan*. |

---

## 🌐 REST API Specification

The local HTTP server on port `3456` exposes JSON REST endpoints:

* `GET /api/stats` — Workspace metrics (counts, unread, task statuses, system health).
* `GET /api/updates` — Query feed updates (`?category=...&search=...&limit=...`).
* `POST /api/updates` — Add a new update entry.
* `PATCH /api/updates/:id/read` — Toggle read/unread status.
* `DELETE /api/updates/:id` — Delete an update entry.
* `GET /api/tasks` — List all registered tasks (`?status=...`).
* `POST /api/tasks` — Register a new autonomous task.
* `POST /api/tasks/:id/trigger` — Execute task immediately.
* `GET /api/tasks/:id/logs` — Fetch execution log history for a task.
* `DELETE /api/tasks/:id` — Delete a task registration.

---

## 📁 Storage & Data Isolation

All runtime database state, task logs, and configuration remain isolated in `~/.daily/`:

```
~/.daily/
├── data/
│   ├── daily.db               # SQLite WAL database (updates, tasks, execution logs)
│   └── config.json            # User & server configuration
├── web/
│   └── dist/                  # Built production Web Dashboard assets
├── mcp/
│   └── index.js               # Stdio MCP Server
├── server/
│   ├── index.js               # REST API & static file server
│   └── scheduler.js           # Autonomous background task scheduler
└── bin/
    └── daily.js               # Global CLI entrypoint
```

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/ziuus/daily-workspace.git
cd daily-workspace

# Install dependencies & build Web Dashboard frontend
npm install
npm run build:web

# Test the backend API server locally
node server/index.js
```

---

## 📄 License

[MIT](LICENSE) © [ziuus](https://github.com/ziuus)
