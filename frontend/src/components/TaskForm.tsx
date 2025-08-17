import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, TaskStatus } from '../types/task';
import { useCreateTask } from '../hooks/useTasks';
import './TaskForm.css';

type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
};

const TaskForm = () => {
  const createTaskMutation = useCreateTask();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.PENDING
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          placeholder="Entrez le titre de la tâche"
          className={errors.title ? 'error' : ''}
        />
        {errors.title && (
          <span className="error-message">{errors.title.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Entrez la description de la tâche"
          rows={3}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && (
          <span className="error-message">{errors.description.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Statut</label>
        <select
          id="status"
          {...register('status')}
          className={errors.status ? 'error' : ''}
        >
          <option value={TaskStatus.PENDING}>En attente</option>
          <option value={TaskStatus.DONE}>Terminé</option>
        </select>
        {errors.status && (
          <span className="error-message">{errors.status.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || createTaskMutation.isPending}
        className="submit-button"
      >
        {isSubmitting || createTaskMutation.isPending ? (
          <>
            <div className="spinner-small"></div>
            Création...
          </>
        ) : (
          'Créer la tâche'
        )}
      </button>

      {createTaskMutation.isError && (
        <div className="error-message">
          Erreur lors de la création de la tâche
        </div>
      )}
    </form>
  );
};

export default TaskForm;
