import { Router, Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskSchema, UpdateTaskSchema, TaskIdSchema } from '../types/task';
import { ZodError } from 'zod';

export class TaskRoutes {
  private router: Router;
  private taskService: TaskService;

  constructor() {
    this.router = Router();
    this.taskService = new TaskService();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET /tasks - Get all tasks
    this.router.get('/', this.getAllTasks.bind(this));

    // POST /tasks - Create a new task
    this.router.post('/', this.createTask.bind(this));

    // DELETE /tasks/:id - Delete a task
    this.router.delete('/:id', this.deleteTask.bind(this));

    // PATCH /tasks/:id - Update task status
    this.router.patch('/:id', this.updateTaskStatus.bind(this));
  }

  private getAllTasks(req: Request, res: Response): void {
    try {
      const tasks = this.taskService.getAllTasks();
      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  private createTask(req: Request, res: Response): void {
    try {
      const validatedData = CreateTaskSchema.parse(req.body);
      const newTask = this.taskService.createTask(validatedData);
      
      res.status(201).json({
        success: true,
        data: newTask
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  private deleteTask(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const validatedId = TaskIdSchema.parse({ id });
      
      const deleted = this.taskService.deleteTask(validatedId.id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Invalid task ID'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  private updateTaskStatus(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const validatedId = TaskIdSchema.parse({ id });
      const validatedData = UpdateTaskSchema.parse(req.body);
      
      const updatedTask = this.taskService.updateTaskStatus(validatedId.id, validatedData);
      
      if (!updatedTask) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedTask
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
