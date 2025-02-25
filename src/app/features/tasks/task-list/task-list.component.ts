import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Task } from '../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskFormComponent,
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
    HeaderComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filteredTasksOriginal: Task[] = [];
  taskToEdit: Task | null = null;
  searchQuery: string = '';
  filterStatus: string = 'all';
  dateSortOrder: string = 'newest';
  prioritySortOrder: string = 'priority-high';
  progress: number = 0;
  pageIndex: number = 0;
  pageSize: number = 6;
  showForm = true;

  constructor(public taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
      this.applyFilter();
      this.calculateProgress();
    });
  }

  toggleFormVisibility(): void {
    this.showForm = !this.showForm;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.calculateProgress(), 0);
  }

  calculateProgress(): void {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    this.progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.filteredTasksOriginal = this.tasks.filter((task) => {
      const matchesStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'completed' && task.completed) ||
        (this.filterStatus === 'incomplete' && !task.completed) ||
        (this.filterStatus === 'overdue' && this.isOverdue(task));

      const matchesSearch = this.searchQuery
        ? task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (task.description &&
            task.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()))
        : true;

      return matchesStatus && matchesSearch;
    });
    this.applyPrioritySort();
    this.applyDateSort();
    this.updatePaginatedTasks();
  }

  applyDateSort(): void {
    if (this.dateSortOrder === 'newest') {
      this.filteredTasksOriginal.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.dateSortOrder === 'oldest') {
      this.filteredTasksOriginal.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    this.updatePaginatedTasks();
  }

  applyPrioritySort(): void {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    this.filteredTasksOriginal.sort((a, b) => {
      return this.prioritySortOrder === 'priority-high'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    this.updatePaginatedTasks();
  }

  startEdit(task: Task): void {
    this.taskToEdit = { ...task };
  }

  handleTaskAdded(task: Task): void {
    task.createdAt = new Date(task.createdAt);
    this.taskService.addTask(task);
  }

  handleTaskUpdated(task: Task): void {
    this.taskService.updateTask(task);
    this.taskToEdit = null;
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  toggleTaskCompletion(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask);
    this.calculateProgress();
    this.applyFilter();
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

  onLoginClicked(): void {
    // future login logic here
    console.log('Login button clicked!');
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
}
