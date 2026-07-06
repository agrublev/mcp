import { z } from 'zod';
import { ToolDefinition, formatResult, formatError } from './base.js';

// ── List Tasks ─────────────────────────────────────────────────────────────

export const listTasksSchema = {
  task_list_id: z.string().describe('The ID of the task list (task group) to retrieve tasks from.'),
};

export const listTasksTool: ToolDefinition = {
  name: 'list_tasks',
  description: 'List all tasks inside a specific Freedcamp task list.',
  inputSchema: listTasksSchema,
  async handler(args, client) {
    try {
      const { task_list_id } = z.object(listTasksSchema).parse(args);
      const tasks = await client.listTasks(task_list_id);
      return formatResult({ tasks });
    } catch (error) {
      return formatError(error);
    }
  },
};

// ── Get Task ───────────────────────────────────────────────────────────────

export const getTaskSchema = {
  task_id: z.string().describe('The ID of the task to retrieve.'),
};

export const getTaskTool: ToolDefinition = {
  name: 'get_task',
  description: 'Get details of a specific Freedcamp task by its ID.',
  inputSchema: getTaskSchema,
  async handler(args, client) {
    try {
      const { task_id } = z.object(getTaskSchema).parse(args);
      const task = await client.getTask(task_id);
      return formatResult({ task });
    } catch (error) {
      return formatError(error);
    }
  },
};

// ── Create Task ────────────────────────────────────────────────────────────

export const createTaskSchema = {
  task_list_id: z.string().describe('The ID of the task list (task group) to add the task to.'),
  title: z.string().min(1).describe('The title of the new task.'),
  description: z.string().optional().describe('Optional description for the task.'),
  due_date: z
    .string()
    .optional()
    .describe('Optional due date for the task in YYYY-MM-DD format.'),
  assigned_to_id: z
    .string()
    .optional()
    .describe('Optional user ID to assign the task to.'),
  priority: z
    .number()
    .int()
    .min(0)
    .max(3)
    .optional()
    .describe('Priority level: 0 = none, 1 = low, 2 = normal, 3 = high.'),
};

export const createTaskTool: ToolDefinition = {
  name: 'create_task',
  description: 'Create a new task in a Freedcamp task list.',
  inputSchema: createTaskSchema,
  async handler(args, client) {
    try {
      const parsed = z.object(createTaskSchema).parse(args);
      const task = await client.createTask({
        taskListId: parsed.task_list_id,
        title: parsed.title,
        description: parsed.description,
        dueDate: parsed.due_date,
        assignedToId: parsed.assigned_to_id,
        priority: parsed.priority,
      });
      return formatResult({ task });
    } catch (error) {
      return formatError(error);
    }
  },
};

// ── Update Task ────────────────────────────────────────────────────────────

export const updateTaskSchema = {
  task_id: z.string().describe('The ID of the task to update.'),
  title: z.string().optional().describe('New title for the task.'),
  description: z.string().optional().describe('New description for the task.'),
  due_date: z.string().optional().describe('New due date in YYYY-MM-DD format.'),
  assigned_to_id: z.string().optional().describe('User ID to re-assign the task to.'),
  priority: z
    .number()
    .int()
    .min(0)
    .max(3)
    .optional()
    .describe('Priority level: 0 = none, 1 = low, 2 = normal, 3 = high.'),
  status: z
    .number()
    .int()
    .optional()
    .describe('Task status: 0 = open, 1 = completed.'),
};

export const updateTaskTool: ToolDefinition = {
  name: 'update_task',
  description: 'Update an existing Freedcamp task.',
  inputSchema: updateTaskSchema,
  async handler(args, client) {
    try {
      const parsed = z.object(updateTaskSchema).parse(args);
      const { task_id, ...rest } = parsed;
      const task = await client.updateTask(task_id, {
        title: rest.title,
        description: rest.description,
        dueDate: rest.due_date,
        assignedToId: rest.assigned_to_id,
        priority: rest.priority,
        status: rest.status,
      });
      return formatResult({ task });
    } catch (error) {
      return formatError(error);
    }
  },
};

// ── Delete Task ────────────────────────────────────────────────────────────

export const deleteTaskSchema = {
  task_id: z.string().describe('The ID of the task to permanently delete.'),
};

export const deleteTaskTool: ToolDefinition = {
  name: 'delete_task',
  description: 'Permanently delete a Freedcamp task.',
  inputSchema: deleteTaskSchema,
  async handler(args, client) {
    try {
      const { task_id } = z.object(deleteTaskSchema).parse(args);
      await client.deleteTask(task_id);
      return formatResult({ message: `Task ${task_id} deleted successfully.` });
    } catch (error) {
      return formatError(error);
    }
  },
};

// ── Add Comment ────────────────────────────────────────────────────────────

export const addCommentSchema = {
  task_id: z.string().describe('The ID of the task to add a comment to.'),
  content: z.string().min(1).describe('The text content of the comment.'),
};

export const addCommentTool: ToolDefinition = {
  name: 'add_comment',
  description: 'Add a comment to a Freedcamp task.',
  inputSchema: addCommentSchema,
  async handler(args, client) {
    try {
      const { task_id, content } = z.object(addCommentSchema).parse(args);
      const comment = await client.addComment(task_id, content);
      return formatResult({ comment });
    } catch (error) {
      return formatError(error);
    }
  },
};
