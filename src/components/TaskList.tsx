import { TaskItem } from './TaskItem.tsx';
import type { Task, PriorityLevel } from '../types/task.ts';

interface TaskListProps {
  tasks: Task[];
  priorities: PriorityLevel[];
  onToggleComplete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string, title: string, priorityId: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  priorities,
  onToggleComplete,
  onToggleFavorite,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="task-list-empty">Aucune tâche à afficher.</p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          priorities={priorities}
          onToggleComplete={onToggleComplete}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
