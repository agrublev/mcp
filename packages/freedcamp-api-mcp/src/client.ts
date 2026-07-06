import { createHmac } from 'crypto';

const BASE_URL = 'https://freedcamp.com/api/v1';

export interface FreedcampClientConfig {
  apiKey: string;
  apiSecret?: string;
}

export class FreedcampClient {
  private apiKey: string;
  private apiSecret?: string;

  constructor(config: FreedcampClientConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  /**
   * Build authentication query parameters.
   * Uses secured HMAC-SHA1 mode when apiSecret is provided, otherwise plain api_key mode.
   * Note: HMAC-SHA1 is used here for Freedcamp's request-signing scheme (not password storage).
   */
  private buildAuthParams(): Record<string, string> {
    if (this.apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      // The Freedcamp secured-API spec requires: HMAC-SHA1(apiKey + timestamp, apiSecret)
      const message = this.apiKey + timestamp;
      const hash = createHmac('sha1', this.apiSecret).update(message).digest('hex');
      return { api_key: this.apiKey, timestamp, hash };
    }
    return { api_key: this.apiKey };
  }

  private buildUrl(path: string, extraParams?: Record<string, string>): string {
    const params = { ...this.buildAuthParams(), ...extraParams };
    const qs = new URLSearchParams(params).toString();
    return `${BASE_URL}${path}?${qs}`;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const url = this.buildUrl(path);
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch {
        errorText = response.statusText;
      }
      throw new Error(`Freedcamp API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  async listProjects(): Promise<FreedcampProject[]> {
    const res = await this.request<{ data: { projects: FreedcampProject[] } }>('GET', '/projects');
    return res.data.projects ?? [];
  }

  async getProject(projectId: string): Promise<FreedcampProject> {
    const res = await this.request<{ data: { projects: FreedcampProject[] } }>(
      'GET',
      `/projects/${projectId}`,
    );
    const project = res.data.projects?.[0];
    if (!project) throw new Error(`Project ${projectId} not found`);
    return project;
  }

  // ── Task Lists ─────────────────────────────────────────────────────────────

  async listTaskLists(projectId: string): Promise<FreedcampTaskList[]> {
    const res = await this.request<{ data: { task_groups: FreedcampTaskList[] } }>(
      'GET',
      `/projects/${projectId}/task_groups`,
    );
    return res.data.task_groups ?? [];
  }

  async createTaskList(projectId: string, title: string): Promise<FreedcampTaskList> {
    const res = await this.request<{ data: { task_groups: FreedcampTaskList[] } }>('POST', '/task_groups', {
      project_id: projectId,
      title,
    });
    const taskList = res.data.task_groups?.[0];
    if (!taskList) throw new Error('Failed to create task list');
    return taskList;
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────

  async listTasks(taskListId: string): Promise<FreedcampTask[]> {
    const res = await this.request<{ data: { tasks: FreedcampTask[] } }>(
      'GET',
      `/task_groups/${taskListId}/tasks`,
    );
    return res.data.tasks ?? [];
  }

  async getTask(taskId: string): Promise<FreedcampTask> {
    const res = await this.request<{ data: { tasks: FreedcampTask[] } }>('GET', `/tasks/${taskId}`);
    const task = res.data.tasks?.[0];
    if (!task) throw new Error(`Task ${taskId} not found`);
    return task;
  }

  async createTask(params: CreateTaskParams): Promise<FreedcampTask> {
    const res = await this.request<{ data: { tasks: FreedcampTask[] } }>('POST', '/tasks', {
      task_group_id: params.taskListId,
      title: params.title,
      description: params.description,
      due_date: params.dueDate,
      assigned_to_id: params.assignedToId,
      priority: params.priority,
    });
    const task = res.data.tasks?.[0];
    if (!task) throw new Error('Failed to create task');
    return task;
  }

  async updateTask(taskId: string, params: UpdateTaskParams): Promise<FreedcampTask> {
    const res = await this.request<{ data: { tasks: FreedcampTask[] } }>('PUT', `/tasks/${taskId}`, {
      title: params.title,
      description: params.description,
      due_date: params.dueDate,
      assigned_to_id: params.assignedToId,
      priority: params.priority,
      status: params.status,
    });
    const task = res.data.tasks?.[0];
    if (!task) throw new Error('Failed to update task');
    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request<unknown>('DELETE', `/tasks/${taskId}`);
  }

  // ── Comments ───────────────────────────────────────────────────────────────

  async addComment(taskId: string, content: string): Promise<FreedcampComment> {
    const OBJECT_TYPE_TASK = 3; // Freedcamp object type identifier for tasks
    const res = await this.request<{ data: { comments: FreedcampComment[] } }>('POST', '/comments', {
      object_id: taskId,
      object_type: OBJECT_TYPE_TASK,
      content,
    });
    const comment = res.data.comments?.[0];
    if (!comment) throw new Error('Failed to add comment');
    return comment;
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface FreedcampProject {
  id: string;
  title: string;
  description?: string;
  status?: number;
  created_timestamp?: number;
}

export interface FreedcampTaskList {
  id: string;
  title: string;
  project_id?: string;
}

export interface FreedcampTask {
  id: string;
  title: string;
  description?: string;
  task_group_id?: string;
  project_id?: string;
  due_date?: string;
  assigned_to_id?: string;
  priority?: number;
  status?: number;
  created_timestamp?: number;
}

export interface FreedcampComment {
  id: string;
  object_id?: string;
  content?: string;
  created_timestamp?: number;
}

export interface CreateTaskParams {
  taskListId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedToId?: string;
  priority?: number;
}

export interface UpdateTaskParams {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedToId?: string;
  priority?: number;
  status?: number;
}
