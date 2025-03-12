import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  private isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token || token.split('.').length !== 3) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  fetchTasks(): void {
    if (this.isTokenExpired()) {
      this.handleUnauthorized();
      return;
    }

    this.http
      .get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (tasks) => this.tasksSubject.next(tasks),
        error: (err) => {
          if (err.status === 401) {
            this.handleUnauthorized();
          }
          console.error('Error fetching tasks:', err);
        },
      });
  }

  private toggleTaskProperty(
    task: Task,
    property: 'pinned' | 'completed'
  ): void {
    const updatedTask = { ...task, [property]: !task[property] };
    this.updateLocalTask(updatedTask);

    this.http
      .put(`${this.apiUrl}/${task._id}`, updatedTask, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        error: (err) => {
          console.error(`Error toggling ${property}:`, err);
          this.fetchTasks();
        },
      });
  }

  togglePin(task: Task): void {
    this.toggleTaskProperty(task, 'pinned');
  }

  toggleTaskCompletion(task: Task): void {
    this.toggleTaskProperty(task, 'completed');
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
          this.tasksSubject.next([...this.tasksSubject.value, savedTask]);
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
