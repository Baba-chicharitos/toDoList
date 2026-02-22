import { useState, type FormEvent } from 'react';
import type { PriorityLevel } from '../types/task.ts';

interface PriorityManagerProps {
  priorities: PriorityLevel[];
  onPrioritiesChange: (list: PriorityLevel[]) => void;
  taskCountByPriorityId: Map<string, number>;
}

export function PriorityManager({
  priorities,
  onPrioritiesChange,
  taskCountByPriorityId,
}: PriorityManagerProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editRank, setEditRank] = useState(0);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#b8e0c8');
  const [newRank, setNewRank] = useState(1);

  const sorted = [...priorities].sort((a, b) => b.rank - a.rank);

  function normalizeRanks(list: PriorityLevel[]): PriorityLevel[] {
    const byRank = [...list].sort((a, b) => b.rank - a.rank);
    return byRank.map((p, i) => ({ ...p, rank: byRank.length - i }));
  }

  function handleStartEdit(p: PriorityLevel) {
    setEditingId(p.id);
    setEditLabel(p.label);
    setEditColor(p.color);
    setEditRank(p.rank);
  }

  function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    const label = editLabel.trim();
    if (!label) return;
    onPrioritiesChange(
      priorities.map((x) =>
        x.id === editingId
          ? { ...x, label, color: editColor, rank: editRank }
          : x
      )
    );
    setEditingId(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
  }

  function handleDelete(p: PriorityLevel) {
    const count = taskCountByPriorityId.get(p.id) ?? 0;
    if (count > 0) return;
    onPrioritiesChange(priorities.filter((x) => x.id !== p.id));
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    const maxRank = Math.max(0, ...priorities.map((x) => x.rank));
    const newP: PriorityLevel = {
      id: crypto.randomUUID(),
      label,
      color: newColor,
      rank: newRank,
    };
    onPrioritiesChange(normalizeRanks([...priorities, newP]));
    setNewLabel('');
    setNewColor('#b8e0c8');
    setNewRank(maxRank + 1);
  }

  return (
    <section className="priority-manager">
      <button
        type="button"
        className="priority-manager-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        Gérer les priorités
        <span className="priority-manager-chevron">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="priority-manager-content">
          <ul className="priority-manager-list">
            {sorted.map((p) => (
              <li key={p.id} className="priority-manager-item">
                {editingId === p.id ? (
                  <form onSubmit={handleSaveEdit} className="priority-manager-edit-form">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="task-form-input"
                      placeholder="Nom"
                    />
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="priority-manager-color"
                      title="Couleur"
                    />
                    <input
                      type="number"
                      value={editRank}
                      onChange={(e) => setEditRank(Number(e.target.value))}
                      min={1}
                      className="priority-manager-rank"
                    />
                    <button type="submit" className="btn btn-small">OK</button>
                    <button type="button" className="btn btn-small" onClick={handleCancelEdit}>
                      Annuler
                    </button>
                  </form>
                ) : (
                  <>
                    <span
                      className="priority-manager-dot"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="priority-manager-label">{p.label}</span>
                    <span className="priority-manager-rank-badge">rang {p.rank}</span>
                    <div className="priority-manager-actions">
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => handleStartEdit(p)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(p)}
                        disabled={priorities.length <= 1 || (taskCountByPriorityId.get(p.id) ?? 0) > 0}
                        title={
                          priorities.length <= 1
                            ? 'Impossible : il doit rester au moins une priorité'
                            : (taskCountByPriorityId.get(p.id) ?? 0) > 0
                              ? 'Impossible : des tâches utilisent cette priorité'
                              : 'Supprimer'
                        }
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAdd} className="priority-manager-add">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="task-form-input"
              placeholder="Nouvelle priorité"
            />
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="priority-manager-color"
            />
            <input
              type="number"
              value={newRank}
              onChange={(e) => setNewRank(Number(e.target.value))}
              min={1}
              className="priority-manager-rank"
            />
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </form>
        </div>
      )}
    </section>
  );
}
