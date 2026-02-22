import { useState, useEffect, useMemo, type FormEvent } from 'react';
import type { PriorityLevel } from '../types/task.ts';
import { PrioritySelect } from './PrioritySelect.tsx';

interface TaskFormProps {
  priorities: PriorityLevel[];
  onSubmit: (title: string, priorityId: string) => void;
}

export function TaskForm({ priorities, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const defaultPriorityId = useMemo(() => {
    const sorted = [...priorities].sort((a, b) => a.rank - b.rank);
    return sorted[0]?.id ?? '';
  }, [priorities]);
  const [priorityId, setPriorityId] = useState(defaultPriorityId);

  useEffect(() => {
    if (defaultPriorityId && !priorities.some((p) => p.id === priorityId)) {
      setPriorityId(defaultPriorityId);
    }
  }, [priorities, defaultPriorityId, priorityId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSubmit(t, priorityId || defaultPriorityId);
    setTitle('');
    setPriorityId(defaultPriorityId);
  }

  if (priorities.length === 0) return null;

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche..."
        className="task-form-input"
        maxLength={500}
      />
      <PrioritySelect
        priorities={priorities}
        valueId={priorityId || defaultPriorityId}
        onChange={setPriorityId}
        aria-label="Priorité"
        className="task-form-priority-select"
      />
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  );
}
