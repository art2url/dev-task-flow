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
      .subscribe((tasks) => this.tasksSubject.next(tasks));
  }

  togglePin(task: Task): void {
    const updatedTask = { ...task, pinned: !task.pinned };
    this.updateLocalTask(updatedTask); // Optimistic UI update

    this.http
      .put(`${this.apiUrl}/${task._id}`, updatedTask, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        error: (err) => {
          console.error('Error updating task:', err);
          this.fetchTasks(); // Rollback if failed
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
          console.error('Error updating task:', err);
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
    const tasks = [...this.tasksSubject.value, task];
    this.tasksSubject.next(tasks);

    this.http
      .post<Task>(this.apiUrl, task, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (savedTask) => {
          const updatedTasks = this.tasksSubject.value.map((t) =>
            t._id === task._id ? { ...task, _id: savedTask._id } : t
          );
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
      .subscribe(() => this.fetchTasks());
  }

  deleteTask(taskId: string): void {
    const tasks = this.tasksSubject.value.filter((t) => t._id !== taskId);
    this.tasksSubject.next(tasks);

    this.http
      .delete(`${this.apiUrl}/${taskId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error('Error deleting task:', err);
          this.fetchTasks();
        },
      });
  }

  clearAllTasks(): void {
    this.http
      .delete(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe(() => this.fetchTasks());
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}
