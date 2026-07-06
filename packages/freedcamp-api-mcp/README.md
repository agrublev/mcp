<div align="center">

# 🚀 Freedcamp MCP Server

<p>
  <a href="https://github.com/agrublev/mcp/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Node.js-v20+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/MCP-Compatible-blueviolet" alt="MCP Compatible">
  <img src="https://img.shields.io/badge/Claude-Ready-orange" alt="Claude Ready">
  <img src="https://img.shields.io/badge/TypeScript-Powered-blue" alt="TypeScript">
</p>

**Enable AI agents to manage your Freedcamp projects and tasks through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).**

</div>

## 🌟 Overview

This MCP server connects AI assistants (Claude, Cursor, ChatGPT, etc.) to your [Freedcamp](https://freedcamp.com) account, giving them the ability to list projects, manage task lists, create and update tasks, and add comments — all through natural conversation.

## 🧰 Available Tools

| Tool | Description |
|------|-------------|
| `list_projects` | List all Freedcamp projects accessible to the authenticated user |
| `get_project` | Get details of a specific project by ID |
| `list_task_lists` | List all task lists (task groups) in a project |
| `create_task_list` | Create a new task list inside a project |
| `list_tasks` | List all tasks in a task list |
| `get_task` | Get details of a specific task by ID |
| `create_task` | Create a new task in a task list |
| `update_task` | Update an existing task (title, description, due date, assignee, priority, status) |
| `delete_task` | Permanently delete a task |
| `add_comment` | Add a comment to a task |

## 🔑 Authentication

The server authenticates with the Freedcamp API using an **API key** (and an optional **API secret** for HMAC-SHA1 secured requests).

### Getting your API credentials

1. Log in to your [Freedcamp](https://freedcamp.com) account.
2. Go to **My Account → Integrations → API**.
3. Copy your **API key**.
4. Optionally, copy your **API secret** for secured authentication (recommended).

## 🚀 Quick Start

### For Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "freedcamp": {
      "command": "npx",
      "args": ["@freedcamp/freedcamp-api-mcp@latest"],
      "env": {
        "FREEDCAMP_API_KEY": "your_api_key",
        "FREEDCAMP_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

### For Cursor or other MCP clients

```json
{
  "mcpServers": {
    "freedcamp": {
      "command": "node",
      "args": ["/path/to/packages/freedcamp-api-mcp/dist/index.js"],
      "env": {
        "FREEDCAMP_API_KEY": "your_api_key",
        "FREEDCAMP_API_SECRET": "your_api_secret"
      }
    }
  }
}
```

### Command-line flags

```bash
FREEDCAMP_API_KEY=your_key node dist/index.js
# or with flags:
node dist/index.js --api-key your_key --api-secret your_secret
```

| Flag | Short | Env Variable | Description | Required |
|------|-------|--------------|-------------|----------|
| `--api-key` | `-k` | `FREEDCAMP_API_KEY` | Freedcamp API key | **Yes** |
| `--api-secret` | `-s` | `FREEDCAMP_API_SECRET` | Freedcamp API secret (for HMAC auth) | No |

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/agrublev/mcp.git
cd mcp

# Install dependencies
yarn install

# Build the Freedcamp MCP server
yarn workspace @freedcamp/freedcamp-api-mcp build

# Run the server
FREEDCAMP_API_KEY=your_key node packages/freedcamp-api-mcp/dist/index.js
```

## 📚 Example Prompts

Once connected, try asking your AI assistant:

- "List all my Freedcamp projects"
- "Show me the tasks in task list 12345"
- "Create a task called 'Fix login bug' in task list 12345 with high priority"
- "Mark task 67890 as completed"
- "Add a comment to task 67890: 'Reviewed and approved'"

## 🔐 Security Best Practices

- **Never commit your API key** to version control.
- Use the **API secret** for HMAC-SHA1 secured requests when possible.
- Store credentials in environment variables, not hardcoded in config files.

## 📄 License

MIT — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ for Freedcamp users</p>
  <p>
    <a href="https://freedcamp.com">Freedcamp</a> |
    <a href="https://modelcontextprotocol.io">Model Context Protocol</a>
  </p>
</div>
