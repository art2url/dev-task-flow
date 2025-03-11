import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskControlsComponent } from '../task-controls/task-controls.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskService } from '../task.service';
import { ShowFormService } from '../../../shared/services/show-form.service';

// Import Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskFormComponent,
    TaskControlsComponent,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  isWideScreen: boolean = window.innerWidth > 525;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filteredTasksOriginal: Task[] = [];
  taskToEdit: Task | null = null;
  progress: number = 0;
  pageIndex: number = 0;
  pageSize: number = 6;
  showForm = true;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    public taskService: TaskService,
    private dialog: MatDialog,
    public showFormService: ShowFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    if (!localStorage.getItem('authToken') || this.isTokenExpired()) {
      this.router.navigate(['/login']);
      return;
    }

    fromEvent(window, 'resize')
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(() => this.checkScreenSize());

    this.showFormService.showForm$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showForm = value;
      });

    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        this.tasks = tasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));

        this.filteredTasks = [...this.tasks];
        this.filteredTasksOriginal = [...this.tasks];
        this.calculateProgress();

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      });

    this.taskService.fetchTasks();
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkScreenSize(): void {
    this.isWideScreen = window.innerWidth > 525;
  }

  onFilteredTasksChange(newList: Task[]): void {
    this.filteredTasksOriginal = newList;
    this.pageIndex = 0;
    this.updatePaginatedTasks();
  }

  togglePin(task: Task): void {
    this.taskService.togglePin(task);
  }

  calculateProgress(): void {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    this.progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }

  handleTaskAdded(task: Task): void {
    task.createdAt = new Date(task.createdAt);
    this.taskService.addTask(task);
  }

  handleTaskUpdated(task: Task): void {
    this.taskService.updateTask(task);
    this.taskToEdit = null;
  }

  startEdit(task: Task): void {
    this.taskToEdit = { ...task };
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTasks();
  }

  updatePaginatedTasks(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredTasks = this.filteredTasksOriginal.slice(startIndex, endIndex);
  }

  isOverdue(task: Task): boolean {
    return task.deadline
      ? new Date(task.deadline) < new Date() && !task.completed
      : false;
  }

  clearAllTasks(): void {
    this.taskService.clearAllTasks();
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      hasBackdrop: true,
      backdropClass: 'custom-dialog-backdrop',
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to delete all tasks? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clearAllTasks();
      }
    });
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}
