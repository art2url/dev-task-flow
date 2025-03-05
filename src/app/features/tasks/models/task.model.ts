export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  deadline?: Date | null;
  pinned?: boolean;
}
