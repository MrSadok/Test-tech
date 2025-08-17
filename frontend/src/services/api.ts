import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task API service
export const taskApi = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch tasks');
    }
    return response.data.data || [];
  },

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create task');
    }
    return response.data.data!;
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete task');
    }
  },

  // Update task status
  async updateTaskStatus(id: string, updateData: UpdateTaskRequest): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, updateData);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update task');
    }
    return response.data.data!;
  },
};

export default api;
