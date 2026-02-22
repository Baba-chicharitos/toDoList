import type { Task, PriorityLevel } from '../types/task.ts';

const STORAGE_KEY_TASKS = 'todo-app-tasks';
const STORAGE_KEY_PRIORITIES = 'todo-app-priorities';

const LEGACY_PRIORITY_TO_ID: Record<string, string> = {
  haute: 'default-haute',
  moyenne: 'default-moyenne',
  basse: 'default-basse',
};

export const DEFAULT_PRIORITIES: PriorityLevel[] = [
  { id: 'default-haute', label: 'Haute', color: '#e8b4b8', rank: 3 },
  { id: 'default-moyenne', label: 'Moyenne', color: '#f0d4b0', rank: 2 },
  { id: 'default-basse', label: 'Basse', color: '#b8e0c8', rank: 1 },
];

function isValidPriorityLevel(item: unknown): item is PriorityLevel {
  if (item === null || typeof item !== 'object') return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.label === 'string' &&
    typeof o.color === 'string' &&
    typeof o.rank === 'number'
  );
}

export function loadPriorities(): PriorityLevel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRIORITIES);
    if (!raw) {
      const def = [...DEFAULT_PRIORITIES];
      savePriorities(def);
      return def;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      const def = [...DEFAULT_PRIORITIES];
      savePriorities(def);
      return def;
    }
    const list = parsed.filter(isValidPriorityLevel);
    if (list.length === 0) {
      const def = [...DEFAULT_PRIORITIES];
      savePriorities(def);
      return def;
    }
    return list.sort((a, b) => b.rank - a.rank);
  } catch {
    const def = [...DEFAULT_PRIORITIES];
    savePriorities(def);
    return def;
  }
}

export function savePriorities(priorities: PriorityLevel[]): void {
  localStorage.setItem(STORAGE_KEY_PRIORITIES, JSON.stringify(priorities));
}

function isValidTask(item: unknown): item is Task {
  if (item === null || typeof item !== 'object') return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.priorityId === 'string' &&
    typeof o.favorite === 'boolean' &&
    typeof o.completed === 'boolean' &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string'
  );
}

function isLegacyTask(item: Record<string, unknown>): item is Record<string, unknown> & { priority: 'haute' | 'moyenne' | 'basse' } {
  return (
    (item.priority === 'haute' || item.priority === 'moyenne' || item.priority === 'basse') &&
    !('priorityId' in item && typeof item.priorityId === 'string')
  );
}

function migrateTask(task: Record<string, unknown>): Task | null {
  if (isLegacyTask(task)) {
    const priorityId = LEGACY_PRIORITY_TO_ID[task.priority];
    if (!priorityId) return null;
    const { priority: _, ...rest } = task;
    return { ...rest, priorityId } as Task;
  }
  if (isValidTask(task)) return task;
  return null;
}

export function loadTasks(priorities: PriorityLevel[]): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    let migrated = false;
    const result: Task[] = [];
    for (const item of parsed) {
      if (item !== null && typeof item === 'object') {
        const task = migrateTask(item as Record<string, unknown>);
        if (task) {
          const priorityExists = priorities.some((p) => p.id === task.priorityId);
          if (priorityExists) {
            result.push(task);
          } else {
            const defaultId = DEFAULT_PRIORITIES[0]?.id ?? priorities[0]?.id;
            if (defaultId) result.push({ ...task, priorityId: defaultId });
          }
          if (isLegacyTask(item as Record<string, unknown>)) migrated = true;
        }
      }
    }
    if (migrated) saveTasks(result);
    return result;
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
}

export function clearTasksStorage(): void {
  localStorage.removeItem(STORAGE_KEY_TASKS);
}
