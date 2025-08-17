import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
  private tasks: Task[] = [];

  // Get all tasks
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  // Get task by ID
  getTaskById(id: string): Task | null {
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  // Create a new task
  createTask(taskData: CreateTaskRequest): Task {
    const now = new Date();
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      createdAt: now,
      updatedAt: now
    };

    this.tasks.push(newTask);
    return { ...newTask };
  }

  // Update task status
  updateTaskStatus(id: string, updateData: UpdateTaskRequest): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      status: updateData.status,
      updatedAt: new Date()
    };

    return { ...this.tasks[taskIndex] };
  }

  // Delete task
  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  // Get tasks by status (optional utility method)
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(t => t.status === status);
  }
}
