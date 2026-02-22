import type { Task, PriorityLevel } from '../types/task.ts';

function rankMap(priorities: PriorityLevel[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of priorities) map.set(p.id, p.rank);
  return map;
}

export function sortTasks(tasks: Task[], priorities: PriorityLevel[]): Task[] {
  const rankBy = rankMap(priorities);
  return [...tasks].sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    const ra = rankBy.get(a.priorityId) ?? 0;
    const rb = rankBy.get(b.priorityId) ?? 0;
    if (ra !== rb) return rb - ra;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}
