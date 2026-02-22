import { useState, type FormEvent } from 'react';
import type { Task, PriorityLevel } from '../types/task.ts';
import { PrioritySelect } from './PrioritySelect.tsx';

interface TaskItemProps {
  task: Task;
  priorities: PriorityLevel[];
  onToggleComplete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string, title: string, priorityId: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  priorities,
  onToggleComplete,
  onToggleFavorite,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriorityId, setEditPriorityId] = useState(task.priorityId);
  const [menuOpen, setMenuOpen] = useState(false);

  const priority = priorities.find((p) => p.id === task.priorityId);

  function handleSubmitEdit(e: FormEvent) {
    e.preventDefault();
    const t = editTitle.trim();
    if (!t) return;
    if (t !== task.title || editPriorityId !== task.priorityId) {
      onEdit(task.id, t, editPriorityId);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditTitle(task.title);
    setEditPriorityId(task.priorityId);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="task-item task-item--editing">
        <form onSubmit={handleSubmitEdit} className="task-item-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-form-input"
            autoFocus
          />
          <PrioritySelect
            priorities={priorities}
            valueId={editPriorityId}
            onChange={setEditPriorityId}
            className="task-item-priority-select"
          />
          <button type="submit" className="btn btn-small">OK</button>
          <button type="button" className="btn btn-small" onClick={cancelEdit}>
            Annuler
          </button>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''} ${task.favorite ? 'task-item--favorite' : ''}`}
    >
      <button
        type="button"
        className="task-item-fav"
        onClick={() => onToggleFavorite(task.id)}
        aria-label={task.favorite ? 'Retirer des favoris' : 'Mettre en favori'}
        title={task.favorite ? 'Retirer des favoris' : 'Favori'}
      >
        {task.favorite ? '★' : '☆'}
      </button>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="task-item-checkbox"
        aria-label="Marquer comme terminée"
      />
      <span className="task-item-title">{task.title}</span>
      {priority && (
        <span
          className="task-item-priority"
          style={{ backgroundColor: priority.color, color: getContrastColor(priority.color) }}
        >
          {priority.label}
        </span>
      )}
      <div className="task-item-menu-wrap">
        <button
          type="button"
          className="task-item-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Actions"
          aria-expanded={menuOpen}
        >
          ⋮
        </button>
        {menuOpen && (
          <>
            <div
              className="task-item-menu-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <div className="task-item-menu" role="menu">
              <button
                type="button"
                className="task-item-menu-item"
                onClick={() => {
                  setEditTitle(task.title);
                  setEditPriorityId(task.priorityId);
                  setEditing(true);
                  setMenuOpen(false);
                }}
              >
                Éditer
              </button>
              <button
                type="button"
                className="task-item-menu-item task-item-menu-item--danger"
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
              >
                Supprimer
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}

function getContrastColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#2c2c2c' : '#fff';
}
