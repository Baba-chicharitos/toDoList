import type { FilterStatus } from '../types/task.ts';

interface FiltersProps {
  filterStatus: FilterStatus;
  onlyFavorites: boolean;
  searchQuery: string;
  onFilterStatusChange: (value: FilterStatus) => void;
  onOnlyFavoritesChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onClearAllTasks: () => void;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'actives', label: 'Actives' },
  { value: 'terminees', label: 'Terminées' },
];

export function Filters({
  filterStatus,
  onlyFavorites,
  searchQuery,
  onFilterStatusChange,
  onOnlyFavoritesChange,
  onSearchChange,
  onClearAllTasks,
}: FiltersProps) {
  return (
    <div className="filters">
      <div className="filters-row">
        <label className="filters-label">
          Filtre :
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value as FilterStatus)}
            className="filters-select"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="filters-checkbox">
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => onOnlyFavoritesChange(e.target.checked)}
          />
          Favoris uniquement
        </label>
      </div>
      <div className="filters-row">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher..."
          className="filters-search"
        />
        <button
          type="button"
          className="btn btn-danger"
          onClick={onClearAllTasks}
        >
          Effacer toutes les tâches
        </button>
      </div>
    </div>
  );
}
