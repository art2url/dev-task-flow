import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private tasks: Task[] = [
    { id: 1, title: 'First Task', completed: false, createdAt: new Date() },
  ];

  constructor() {
    this.tasksSubject.next(this.tasks);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): void {
    this.tasks.push(task);
    this.updateTasks();
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.updateTasks();
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.updateTasks();
  }

  private updateTasks(): void {
    this.tasksSubject.next([...this.tasks]);
  }
}
