#!/usr/bin/env node
const readline = require('node:readline');
const db = require('../data/db.js');
const scheduler = require('../server/scheduler.js');

const SERVER_NAME = 'daily-mcp';
const SERVER_VERSION = '1.1.0';

const TOOLS = [
  {
    name: 'daily_add_update',
    description: 'Add a new daily update entry (tech news, viral repo shortlist, AI tool digest) formatted in markdown.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the update entry' },
        category: {
          type: 'string',
          enum: ['os_project', 'ai_tool', 'tech_news', 'custom'],
          description: 'Category of update'
        },
        markdown_content: { type: 'string', description: 'Full markdown body content' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags for categorization e.g. ["rust", "llm"]'
        },
        source_agent: { type: 'string', description: 'Name of pushing agent (default: hermes)' },
        metadata: { type: 'object', description: 'Structured metadata e.g. { repo_url: "...", stars: 1000 }' }
      },
      required: ['title', 'category', 'markdown_content']
    }
  },
  {
    name: 'daily_get_updates',
    description: 'Fetch recorded daily updates between since timestamp and now.',
    inputSchema: {
      type: 'object',
      properties: {
        since: { type: 'string', description: 'ISO timestamp e.g. 2026-08-10T00:00:00Z' },
        category: { type: 'string', description: 'Filter by category (os_project, ai_tool, tech_news, custom)' },
        limit: { type: 'number', description: 'Max number of entries to return (default 20)' }
      }
    }
  },
  {
    name: 'daily_list_tasks',
    description: 'List all registered autonomous tasks and their execution statuses.',
    inputSchema: {
      type: 'object',
      properties: {
        status_filter: { type: 'string', description: 'Optional status filter (active, paused, error)' }
      }
    }
  },
  {
    name: 'daily_add_task',
    description: 'Register a new autonomous task in the Daily Workspace, specifying which AI agent (hermes, opencode, claude, system) executes it.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique task ID e.g. opencode-repo-audit' },
        name: { type: 'string', description: 'Human readable task name' },
        command_or_prompt: { type: 'string', description: 'Command line string or agent prompt to execute' },
        schedule: { type: 'string', description: 'Schedule string e.g. every 6h, daily @ 09:00' },
        agent_type: { type: 'string', description: 'Agent executor binding: hermes, opencode, claude, system, cli (default: system)' },
        status: { type: 'string', enum: ['active', 'paused'], description: 'Initial task status' }
      },
      required: ['id', 'name', 'command_or_prompt', 'schedule']
    }
  },
  {
    name: 'daily_trigger_task',
    description: 'Manually trigger execution of a specific autonomous task using its bound agent or script.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'ID of the task to execute (e.g. reddit-warmup)' }
      },
      required: ['task_id']
    }
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    handleJsonRpcRequest(request);
  } catch (err) {
    sendJsonRpcError(null, -32700, 'Parse error', err.message);
  }
});

async function handleJsonRpcRequest(req) {
  const { id, method, params } = req;

  // Handle Notifications (no ID)
  if (id === undefined || id === null) {
    if (method === 'notifications/initialized') {
      // client initialization complete
    }
    return;
  }

  switch (method) {
    case 'initialize':
      sendJsonRpcResult(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION
        }
      });
      break;

    case 'tools/list':
      sendJsonRpcResult(id, { tools: TOOLS });
      break;

    case 'tools/call':
      await handleToolCall(id, params);
      break;

    case 'ping':
      sendJsonRpcResult(id, {});
      break;

    default:
      sendJsonRpcError(id, -32601, 'Method not found', `Method ${method} is not supported.`);
      break;
  }
}

async function handleToolCall(id, params) {
  const { name, arguments: args = {} } = params || {};

  try {
    let resultText = '';

    if (name === 'daily_add_update') {
      const created = db.addUpdate({
        title: args.title,
        category: args.category,
        markdown_content: args.markdown_content,
        tags: args.tags || [],
        source_agent: args.source_agent || 'hermes',
        metadata: args.metadata || {}
      });
      resultText = `Successfully created update ID ${created.id}: "${created.title}" under category "${created.category}".`;
    } else if (name === 'daily_get_updates') {
      const updates = db.getUpdates({
        since: args.since,
        category: args.category,
        limit: args.limit || 20
      });
      resultText = JSON.stringify(updates, null, 2);
    } else if (name === 'daily_list_tasks') {
      const tasks = db.getTasks({ status: args.status_filter });
      resultText = JSON.stringify(tasks, null, 2);
    } else if (name === 'daily_add_task') {
      const created = db.addTask({
        id: args.id,
        name: args.name,
        command_or_prompt: args.command_or_prompt,
        schedule: args.schedule,
        status: args.status || 'active',
        agent_type: args.agent_type || 'system'
      });
      resultText = `Successfully registered task "${created.id}" bound to agent "${created.agent_type}".`;
    } else if (name === 'daily_trigger_task') {
      const runRes = await scheduler.runTask(args.task_id);
      resultText = `Task "${args.task_id}" execution completed:\nStatus: ${runRes.success ? 'SUCCESS' : 'FAILED'}\nOutput:\n${runRes.output}`;
    } else {
      return sendJsonRpcError(id, -32601, 'Tool not found', `Tool ${name} is not defined.`);
    }

    sendJsonRpcResult(id, {
      content: [
        {
          type: 'text',
          text: resultText
        }
      ]
    });
  } catch (err) {
    sendJsonRpcResult(id, {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${err.message}`
        }
      ]
    });
  }
}

function sendJsonRpcResult(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result
  };
  process.stdout.write(JSON.stringify(response) + '\n');
}

function sendJsonRpcError(id, code, message, data) {
  const response = {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data
    }
  };
  process.stdout.write(JSON.stringify(response) + '\n');
}
