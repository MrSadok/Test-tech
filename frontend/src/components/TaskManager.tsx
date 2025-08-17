import { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTaskStore } from '../store/taskStore';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import './TaskManager.css';

const TaskManager = () => {
  const { data: tasks, isLoading, error } = useTasks();
  const { setError } = useTaskStore();

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  if (isLoading) {
    return (
      <div className="task-manager">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-manager">
      <div className="task-manager-container">
        <div className="task-manager-header">
          <h2>Gestionnaire de Tâches</h2>
          <TaskStats />
        </div>
        
        <div className="task-manager-content">
          <div className="task-form-section">
            <h3>Ajouter une nouvelle tâche</h3>
            <TaskForm />
          </div>
          
          <div className="task-list-section">
            <h3>Liste des Tâches</h3>
            <TaskList tasks={tasks || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
