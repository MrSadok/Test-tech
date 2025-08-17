import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/api';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { useTaskStore } from '../store/taskStore';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

// Hook to fetch all tasks
export const useTasks = () => {
  const { setTasks, setLoading, setError } = useTaskStore();
  
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async () => {
      setLoading(true);
      try {
        const tasks = await taskApi.getTasks();
        setTasks(tasks);
        setError(null);
        return tasks;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { addTask } = useTaskStore();
  
  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => taskApi.createTask(taskData),
    onSuccess: (newTask) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Update local store
      addTask(newTask);
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
    },
  });
};

// Hook to delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { removeTask } = useTaskStore();
  
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: (_, deletedId) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Update local store
      removeTask(deletedId);
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
  });
};

// Hook to update task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { updateTask } = useTaskStore();
  
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateTaskRequest }) =>
      taskApi.updateTaskStatus(id, updateData),
    onSuccess: (updatedTask) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Update local store
      updateTask(updatedTask.id, updatedTask);
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
    },
  });
};
