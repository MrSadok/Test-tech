import { z } from 'zod';

// Task status enum
export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done'
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING)
});

export const UpdateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus)
});

export const TaskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID')
});

// Type exports
export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;
export type TaskIdParams = z.infer<typeof TaskIdSchema>;
