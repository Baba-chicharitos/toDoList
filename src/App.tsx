import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TaskForm } from './components/TaskForm.tsx';
import { TaskList } from './components/TaskList.tsx';
import { Filters } from './components/Filters.tsx';
import { PriorityManager } from './components/PriorityManager.tsx';
import type { Task, PriorityLevel, FilterStatus } from './types/task.ts';
import {
  loadTasks,
  loadPriorities,
  saveTasks,
  savePriorities,
  clearTasksStorage,
} from './utils/storage.ts';
import { sortTasks } from './utils/sort.ts';
import { generateId } from './utils/uuid.ts';
import './App.css';

function filterAndSearch(
  tasks: Task[],
  filterStatus: FilterStatus,
  onlyFavorites: boolean,
  searchQuery: string
): Task[] {
  let result = tasks;
  if (filterStatus === 'actives') result = result.filter((t) => !t.completed);
  if (filterStatus === 'terminees') result = result.filter((t) => t.completed);
  if (onlyFavorites) result = result.filter((t) => t.favorite);
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    result = result.filter((t) => t.title.toLowerCase().includes(q));
  }
  return result;
}

function countTasksByPriorityId(tasks: Task[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tasks) {
    map.set(t.priorityId, (map.get(t.priorityId) ?? 0) + 1);
  }
  return map;
}

function App() {
  const [priorities, setPriorities] = useState<PriorityLevel[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('toutes');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasHydrated = useRef(false);

  useEffect(() => {
    const p = loadPriorities();
    setPriorities(p);
    setTasks(loadTasks(p));
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (hasHydrated.current) savePriorities(priorities);
  }, [priorities]);

  useEffect(() => {
    if (hasHydrated.current) saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, priorityId: string) => {
    const now = new Date().toISOString();
    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        title,
        priorityId,
        favorite: false,
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, title: string, priorityId: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title, priorityId, updatedAt: now } : t
      )
    );
  }, []);

  const toggleComplete = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t
      )
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, favorite: !t.favorite, updatedAt: now } : t
      )
    );
  }, []);

  const clearAllTasks = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les tâches ?')) {
      clearTasksStorage();
      setTasks([]);
    }
  }, []);

  const handlePrioritiesChange = useCallback((next: PriorityLevel[]) => {
    setPriorities(next);
  }, []);

  const filtered = useMemo(
    () => filterAndSearch(tasks, filterStatus, onlyFavorites, searchQuery),
    [tasks, filterStatus, onlyFavorites, searchQuery]
  );
  const sorted = useMemo(
    () => sortTasks(filtered, priorities),
    [filtered, priorities]
  );
  const taskCountByPriorityId = useMemo(
    () => countTasksByPriorityId(tasks),
    [tasks]
  );

  return (
    <main className="app">
      <header className="app-header">
        <h1>To-Do List</h1>
      </header>
      <TaskForm priorities={priorities} onSubmit={addTask} />
      <PriorityManager
        priorities={priorities}
        onPrioritiesChange={handlePrioritiesChange}
        taskCountByPriorityId={taskCountByPriorityId}
      />
      <Filters
        filterStatus={filterStatus}
        onlyFavorites={onlyFavorites}
        searchQuery={searchQuery}
        onFilterStatusChange={setFilterStatus}
        onOnlyFavoritesChange={setOnlyFavorites}
        onSearchChange={setSearchQuery}
        onClearAllTasks={clearAllTasks}
      />
      <TaskList
        tasks={sorted}
        priorities={priorities}
        onToggleComplete={toggleComplete}
        onToggleFavorite={toggleFavorite}
        onEdit={editTask}
        onDelete={deleteTask}
      />
    </main>
  );
}

export default App;
