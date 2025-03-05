import { MatMenuModule } from '@angular/material/menu';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { Task } from '../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskControlsComponent } from '../task-controls/task-controls.component';

// Material Imports
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
import { ShowFormService } from '../../../shared/services/show-form.service';

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
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filteredTasksOriginal: Task[] = [];
  taskToEdit: Task | null = null;
  progress: number = 0;
  pageIndex: number = 0;
  pageSize: number = 6;
  showForm = true;

  constructor(
    public taskService: TaskService,
    private dialog: MatDialog,
    public showFormService: ShowFormService
  ) {}

  ngOnInit(): void {
    this.showFormService.showForm$.subscribe((value) => {
      this.showForm = value;
    });

    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));

      this.filteredTasks = [...this.tasks];
      this.filteredTasksOriginal = [...this.tasks];
      this.calculateProgress();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.calculateProgress(), 0);
  }

  onFilteredTasksChange(newList: Task[]): void {
    this.filteredTasksOriginal = newList;
    this.pageIndex = 0;
    this.updatePaginatedTasks();
  }

  togglePin(task: Task): void {
    const updatedTask = { ...task, pinned: !task.pinned };
    this.taskService.updateTask(updatedTask);
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

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  toggleTaskCompletion(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask);
    this.calculateProgress();
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

  onLoginClicked(): void {
    console.log('Login button clicked!');
  }
}
