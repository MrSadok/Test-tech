import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import { useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks';
import { Trash2, CheckCircle, Circle, Calendar, Clock } from 'lucide-react';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteTaskMutation = useDeleteTask();
  const updateTaskStatusMutation = useUpdateTaskStatus();

  const handleStatusToggle = async () => {
    const newStatus = task.status === TaskStatus.PENDING 
      ? TaskStatus.DONE 
      : TaskStatus.PENDING;
    
    try {
      await updateTaskStatusMutation.mutateAsync({
        id: task.id,
        updateData: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setIsDeleting(true);
      try {
        await deleteTaskMutation.mutateAsync(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-item ${task.status === TaskStatus.DONE ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <button
            className="status-toggle"
            onClick={handleStatusToggle}
            disabled={updateTaskStatusMutation.isPending}
            title={task.status === TaskStatus.PENDING ? 'Marquer comme terminé' : 'Marquer comme en attente'}
          >
            {task.status === TaskStatus.DONE ? (
              <CheckCircle className="status-icon done" />
            ) : (
              <Circle className="status-icon pending" />
            )}
          </button>
          
          <div className="task-info">
            <h4 className="task-title">{task.title}</h4>
            <p className="task-description">{task.description}</p>
          </div>
        </div>

        <div className="task-meta">
          <div className="task-dates">
            <div className="date-item">
              <Calendar className="date-icon" size={14} />
              <span>Créé le {formatDate(task.createdAt)}</span>
            </div>
            {task.updatedAt !== task.createdAt && (
              <div className="date-item">
                <Clock className="date-icon" size={14} />
                <span>Modifié le {formatDate(task.updatedAt)}</span>
              </div>
            )}
          </div>
          
          <div className="task-actions">
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending || isDeleting}
              title="Supprimer la tâche"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {(updateTaskStatusMutation.isPending || deleteTaskMutation.isPending) && (
        <div className="task-loading">
          <div className="spinner-small"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
