export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  deadline?: Date | null;
  pinned?: boolean;
}
