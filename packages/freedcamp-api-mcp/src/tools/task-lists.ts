import { z } from 'zod';
import { ToolDefinition, formatResult, formatError } from './base.js';

export const listTaskListsSchema = {
  project_id: z.string().describe('The ID of the Freedcamp project whose task lists to retrieve.'),
};

export const listTaskListsTool: ToolDefinition = {
  name: 'list_task_lists',
  description: 'List all task lists (task groups) in a Freedcamp project.',
  inputSchema: listTaskListsSchema,
  async handler(args, client) {
    try {
      const { project_id } = z.object(listTaskListsSchema).parse(args);
      const taskLists = await client.listTaskLists(project_id);
      return formatResult({ task_lists: taskLists });
    } catch (error) {
      return formatError(error);
    }
  },
};

export const createTaskListSchema = {
  project_id: z.string().describe('The ID of the project to add the task list to.'),
  title: z.string().min(1).describe('The title of the new task list.'),
};

export const createTaskListTool: ToolDefinition = {
  name: 'create_task_list',
  description: 'Create a new task list (task group) inside a Freedcamp project.',
  inputSchema: createTaskListSchema,
  async handler(args, client) {
    try {
      const { project_id, title } = z.object(createTaskListSchema).parse(args);
      const taskList = await client.createTaskList(project_id, title);
      return formatResult({ task_list: taskList });
    } catch (error) {
      return formatError(error);
    }
  },
};
