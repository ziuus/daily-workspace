# ⚡ Daily — Workspace, Intelligence Feed & Autonomous Task Dashboard

> A high-density, developer-first workspace, daily intelligence feed, and autonomous cron management dashboard built for developers and AI agents.

[![npm version](https://img.shields.io/npm/v/daily-workspace.svg?color=emerald)](https://www.npmjs.com/package/daily-workspace)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-Stdio%20Server-purple.svg)](mcp/index.js)

---

## 🌟 Key Features

* **📰 Intelligence Feed & GFM Markdown Renderer**: Curated daily digests for viral open-source repositories, trending AI tools & LLMs, and core tech news. Features a rich GitHub-Flavored Markdown renderer with syntax-highlighted code blocks, copy buttons, GFM tables, and callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`).
* **🤖 Autonomous Task & Cron Hub**: Background automation runner for Python scripts, Node.js scrapers, and system watchdogs. Inspect execution statuses, last run times, next run schedules, and real-time terminal output logs.
* **🔌 Built-in MCP Server (`daily-mcp`)**: Native Stdio Model Context Protocol integration allowing AI agents (like Hermes, Claude Desktop, Cursor) to autonomously push markdown updates and query task execution states.
* **🖥️ Developer-First UI/UX**: Inspired by Linear, Supabase, and Vercel. Dark-themed high information density, 3-pane layout, filter tabs, live status indicators, and global `Cmd + K` search command palette.
* **📦 Zero-Dependency Local SQLite Engine**: Powered by Node.js native `node:sqlite` for WAL-mode high performance local storage inside `~/.daily/data/daily.db`.

---

## 🏗️ System Architecture

All runtime database state and logs live isolated inside `~/.daily/`:

```
~/.daily/
├── data/
│   ├── daily.db               # SQLite database (updates, categories, task states, logs)
│   └── config.json            # Configuration settings
├── mcp/
│   └── index.js               # Stdio MCP Server for agent integration
├── server/
│   ├── index.js               # REST API & static web dashboard server
│   └── scheduler.js           # Autonomous background task scheduler
├── web/                       # High-density Web UI (React + Tailwind CSS)
│   └── dist/                  # Compiled production static assets
└── bin/
    └── daily.js               # Global CLI entrypoint
```

---

## 🚀 Quick Start

### Installation

Install globally via npm:

```bash
npm install -g daily-workspace
```

Or run directly with npx:

```bash
npx daily-workspace
```

---

## 💻 CLI Usage

The `daily` CLI binary provides full control over feed entries, task schedules, and background daemons:

```bash
# Launch/open the Web Dashboard in browser (starts server if needed)
daily

# List recent intelligence feed entries in terminal
daily list

# Filter entries by category
daily list --category os_project

# Quick CLI insertion of a markdown update
daily add --title "browser-use: Web Automation LLM Engine" \
          --category os_project \
          --content "### Overview..." \
          --tags "python,agent,playwright"

# Display terminal ASCII table of autonomous background tasks
daily task list

# Manually trigger immediate execution of a task
daily task trigger reddit-warmup

# Pause or resume an autonomous background task
daily task pause reddit-warmup
daily task resume reddit-warmup

# Register a new background cron script
daily task add --id "news-scraper" \
               --name "Daily AI News Scraper" \
               --cmd "node ~/.daily/scripts/scraper.js" \
               --schedule "every 6h"

# Run the API server & task scheduler in foreground
daily serve

# Start stdio MCP server
daily mcp
```

---

## 🤖 MCP Server Integration (`daily-mcp`)

**Daily** includes a stdio MCP server so AI agents (like Hermes or Claude) can autonomously push markdown updates and trigger tasks.

### Hermes Registration (`~/.hermes/config.yaml`)

```yaml
mcp_servers:
  daily-mcp:
    command: "daily"
    args:
      - "mcp"
```

### Exposed MCP Tools

1. **`daily_add_update`**: Push a new markdown intelligence entry.
   * Params: `title` (string), `category` (`os_project` | `ai_tool` | `tech_news` | `custom`), `markdown_content` (string), `tags` (array), `metadata` (object).
2. **`daily_get_updates`**: Fetch recorded daily updates between `since` timestamp and now.
   * Params: `since` (ISO string), `category` (optional string), `limit` (number).
3. **`daily_list_tasks`**: List registered autonomous tasks and their execution statuses.
   * Params: `status_filter` (optional string).
4. **`daily_trigger_task`**: Manually trigger execution of a background task.
   * Params: `task_id` (string).

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/ziuus/daily-workspace.git
cd daily-workspace

# Build web frontend
npm run build:web

# Run backend API server locally
node server/index.js
```

---

## 📄 License

[MIT](LICENSE) © ziuus
