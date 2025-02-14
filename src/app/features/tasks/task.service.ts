import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './models/task.model';

const STORAGE_KEY = 'devTaskFlowTasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.tasksSubject.next(this.tasks);
  }

  private saveTasks(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    this.tasksSubject.next([...this.tasks]);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): void {
    this.tasks.push(task);
    this.saveTasks();
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.saveTasks();
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
  }

  clearAllTasks(): void {
    this.tasks = [];
    localStorage.removeItem(STORAGE_KEY);
    this.tasksSubject.next([]);
  }
}
