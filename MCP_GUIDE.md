# 🔌 Daily MCP Agent Integration Guide

The **Daily MCP Server** (`@ziuus/daily mcp`) follows the open [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) specification via standard I/O (`stdio`).

This guide provides exact copy-paste configuration snippets for integrating **Daily** into every major AI agent, IDE, and developer framework.

---

## 📋 Table of Contents
1. [Claude Desktop](#1-claude-desktop)
2. [Cursor IDE](#2-cursor-ide)
3. [Antigravity / Gemini CLI](#3-antigravity--gemini-cli)
4. [Hermes Agent](#4-hermes-agent)
5. [Windsurf / Codeium Cascade](#5-windsurf--codeium-cascade)
6. [Roo Code / Cline (VS Code)](#6-roo-code--cline-vs-code)
7. [Goose CLI](#7-goose-cli)
8. [Continue.dev](#8-continuedev)
9. [Zed Editor](#9-zed-editor)
10. [Python Frameworks (LangChain / LlamaIndex / CrewAI)](#10-python-frameworks-langchain--llamaindex--crewai)
11. [Node.js / TypeScript SDK](#11-nodejs--typescript-sdk)

---

## 1. Claude Desktop

* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
* **Linux**: `~/.config/Claude/claude_desktop_config.json`

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

---

## 2. Cursor IDE

Go to **Cursor Settings** -> **Features** -> **MCP**, or add to `.cursor/mcp.json` in your workspace root:

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

---

## 3. Antigravity / Gemini CLI

Add to `~/.gemini/antigravity-cli/mcp/daily/daily.json` or your MCP server configuration:

```json
{
  "name": "daily",
  "command": "npx",
  "args": ["-y", "@ziuus/daily", "mcp"]
}
```

---

## 4. Hermes Agent

Add to `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  daily:
    command: "npx"
    args:
      - "-y"
      - "@ziuus/daily"
      - "mcp"
```

---

## 5. Windsurf / Codeium Cascade

Add to `~/.codeium/windsurf/mcp_config.json`:

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

---

## 6. Roo Code / Cline (VS Code)

In VS Code settings, navigate to **Roo Code Settings** -> **MCP Servers**, or edit `cline_mcp_settings.json`:

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

---

## 7. Goose CLI

Run in your terminal:

```bash
goose mcp add daily -- npx -y @ziuus/daily mcp
```

---

## 8. Continue.dev

Add to `~/.continue/config.json`:

```json
{
  "experimental": {
    "modelContextProtocol": [
      {
        "name": "daily",
        "command": "npx",
        "args": ["-y", "@ziuus/daily", "mcp"]
      }
    ]
  }
}
```

---

## 9. Zed Editor

Add to `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "daily": {
      "command": "npx",
      "args": ["-y", "@ziuus/daily", "mcp"]
    }
  }
}
```

---

## 10. Python Frameworks (LangChain / LlamaIndex / CrewAI)

Using the official Python `mcp` SDK:

```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run_daily_agent():
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@ziuus/daily", "mcp"]
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Read updates from Daily feed
            updates = await session.call_tool("daily_get_updates", {"limit": 5})
            print("Daily Feed Updates:", updates)

            # Push a new update
            await session.call_tool("daily_add_update", {
                "title": "DeepSeek R1 Benchmark Audit",
                "category": "ai_tool",
                "markdown_content": "### Audit Summary\nDeepSeek R1 model evaluated.",
                "tags": ["deepseek", "audit"]
            })

asyncio.run(run_daily_agent())
```

---

## 11. Node.js / TypeScript SDK

Using `@modelcontextprotocol/sdk`:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@ziuus/daily', 'mcp']
  });

  const client = new Client({ name: 'custom-agent', version: '1.0.0' }, { capabilities: {} });
  await client.connect(transport);

  // List available tools
  const tools = await client.listTools();
  console.log('Available Daily Tools:', tools);

  // Execute tool
  const result = await client.callTool({
    name: 'daily_get_updates',
    arguments: { limit: 5 }
  });
  console.log('Updates:', result);
}

main();
```
