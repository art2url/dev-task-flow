import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://dev-task-flow-auth-server.onrender.com/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  fetchTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (tasks) => this.tasksSubject.next(tasks),
        error: (err) => console.error('Error fetching tasks:', err),
      });
  }

  togglePin(task: Task): void {
    const updatedTask = { ...task, pinned: !task.pinned };
    this.updateLocalTask(updatedTask);

    this.http
      .put(`${this.apiUrl}/${task._id}`, updatedTask, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        error: (err) => {
          console.error('Error toggling pin:', err);
          this.fetchTasks();
        },
      });
  }

  toggleTaskCompletion(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.updateLocalTask(updatedTask);

    this.http
      .put(`${this.apiUrl}/${task._id}`, updatedTask, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        error: (err) => {
          console.error('Error toggling completion:', err);
          this.fetchTasks();
        },
      });
  }

  private updateLocalTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task._id === updatedTask._id ? updatedTask : task
    );
    this.tasksSubject.next(tasks);
  }

  addTask(task: Task): void {
    this.http
      .post<Task>(this.apiUrl, task, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (savedTask) => {
          const updatedTasks = [...this.tasksSubject.value, savedTask];
          this.tasksSubject.next(updatedTasks);
        },
        error: (err) => {
          console.error('Error adding task:', err);
          this.fetchTasks();
        },
      });
  }

  updateTask(updatedTask: Task): void {
    this.http
      .put(`${this.apiUrl}/${updatedTask._id}`, updatedTask, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: () => this.fetchTasks(),
        error: (err) => {
          console.error('Error updating task:', err);
          this.fetchTasks();
        },
      });
  }

  deleteTask(taskId: string): void {
    const previousTasks = [...this.tasksSubject.value];
    const tasks = previousTasks.filter((t) => t._id !== taskId);
    this.tasksSubject.next(tasks);

    this.http
      .delete(`${this.apiUrl}/${taskId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error('Error deleting task:', err);
          this.tasksSubject.next(previousTasks);
        },
      });
  }

  clearAllTasks(): void {
    this.http
      .delete(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => this.tasksSubject.next([]),
        error: (err) => {
          console.error('Error clearing tasks:', err);
          this.fetchTasks();
        },
      });
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}
