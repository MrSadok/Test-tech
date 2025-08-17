import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import TaskItem from './TaskItem';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING);
  const doneTasks = tasks.filter(task => task.status === TaskStatus.DONE);

  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="empty-state">
          <p>📝 Aucune tâche pour le moment</p>
          <p>Créez votre première tâche pour commencer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === TaskStatus.PENDING ? 'active' : ''}`}
            onClick={() => setFilter(TaskStatus.PENDING)}
          >
            En attente ({pendingTasks.length})
          </button>
          <button
            className={`filter-btn ${filter === TaskStatus.DONE ? 'active' : ''}`}
            onClick={() => setFilter(TaskStatus.DONE)}
          >
            Terminées ({doneTasks.length})
          </button>
        </div>
      </div>

      <div className="task-items">
        {filteredTasks.length === 0 ? (
          <div className="empty-filter">
            <p>Aucune tâche trouvée avec ce filtre</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
