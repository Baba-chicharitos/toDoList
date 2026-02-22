export type FilterStatus = 'toutes' | 'actives' | 'terminees';

export interface PriorityLevel {
  id: string;
  label: string;
  color: string;
  rank: number;
}

export interface Task {
  id: string;
  title: string;
  priorityId: string;
  favorite: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
