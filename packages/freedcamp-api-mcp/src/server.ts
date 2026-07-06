import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FreedcampClient } from './client.js';
import { formatError } from './tools/base.js';
import { listProjectsTool, getProjectTool } from './tools/projects.js';
import { listTaskListsTool, createTaskListTool } from './tools/task-lists.js';
import {
  listTasksTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  deleteTaskTool,
  addCommentTool,
} from './tools/tasks.js';
import type { ToolDefinition } from './tools/base.js';

const ALL_TOOLS: ToolDefinition[] = [
  listProjectsTool,
  getProjectTool,
  listTaskListsTool,
  createTaskListTool,
  listTasksTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  deleteTaskTool,
  addCommentTool,
];

function registerTool(server: McpServer, tool: ToolDefinition, client: FreedcampClient): void {
  if (tool.inputSchema) {
    // TypeScript cannot resolve the deeply-nested Zod generic at the `tool()` call site when the
    // schema is typed as the abstract `ZodRawShape`. Casting to `any` here is safe because
    // the runtime value is always a valid `ZodRawShape`; the MCP SDK validates inputs at runtime.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (server.tool as any)(tool.name, tool.description, tool.inputSchema, async (args: Record<string, unknown>) => {
      try {
        return await tool.handler(args, client);
      } catch (error) {
        return formatError(error);
      }
    });
  } else {
    server.tool(tool.name, tool.description, async () => {
      try {
        return await tool.handler({}, client);
      } catch (error) {
        return formatError(error);
      }
    });
  }
}

export async function runFreedcampMcpServer(config: { apiKey: string; apiSecret?: string }): Promise<void> {
  const client = new FreedcampClient({ apiKey: config.apiKey, apiSecret: config.apiSecret });

  const server = new McpServer(
    { name: 'freedcamp', version: '1.0.0' },
    { capabilities: { tools: { listChanged: false } } },
  );

  for (const tool of ALL_TOOLS) {
    registerTool(server, tool, client);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
