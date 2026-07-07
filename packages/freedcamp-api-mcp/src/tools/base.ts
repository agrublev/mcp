import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { FreedcampClient } from '../client.js';

export type ToolResult = CallToolResult;

export function formatResult(data: unknown): ToolResult {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const structured =
    typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : undefined;
  return {
    content: [{ type: 'text', text }],
    ...(structured ? { structuredContent: structured } : {}),
  };
}

export function formatError(error: unknown): ToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodRawShape | undefined;
  handler: (args: Record<string, unknown>, client: FreedcampClient) => Promise<ToolResult>;
}
