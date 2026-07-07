import { z } from 'zod';
import { ToolDefinition, formatResult, formatError } from './base.js';

export const listProjectsTool: ToolDefinition = {
  name: 'list_projects',
  description: 'List all Freedcamp projects accessible to the authenticated user.',
  inputSchema: undefined,
  async handler(_args, client) {
    try {
      const projects = await client.listProjects();
      return formatResult({ projects });
    } catch (error) {
      return formatError(error);
    }
  },
};

export const getProjectSchema = {
  project_id: z.string().describe('The ID of the Freedcamp project to retrieve.'),
};

export const getProjectTool: ToolDefinition = {
  name: 'get_project',
  description: 'Get details of a specific Freedcamp project by its ID.',
  inputSchema: getProjectSchema,
  async handler(args, client) {
    try {
      const { project_id } = z.object(getProjectSchema).parse(args);
      const project = await client.getProject(project_id);
      return formatResult({ project });
    } catch (error) {
      return formatError(error);
    }
  },
};
