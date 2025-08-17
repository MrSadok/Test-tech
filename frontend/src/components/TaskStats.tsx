import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types/task';
import { CheckCircle, Clock, BarChart3 } from 'lucide-react';
import './TaskStats.css';

const TaskStats = () => {
  const { tasks, getPendingTasks, getDoneTasks } = useTaskStore();
  
  const pendingTasks = getPendingTasks();
  const doneTasks = getDoneTasks();
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="task-stats">
      <div className="stat-item">
        <div className="stat-icon total">
          <BarChart3 size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-value">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon pending">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-value">{pendingTasks.length}</span>
          <span className="stat-label">En attente</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon done">
          <CheckCircle size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-value">{doneTasks.length}</span>
          <span className="stat-label">Terminées</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon completion">
          <div className="completion-circle">
            <span className="completion-percentage">{completionRate}%</span>
          </div>
        </div>
        <div className="stat-content">
          <span className="stat-value">{completionRate}%</span>
          <span className="stat-label">Taux de completion</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
