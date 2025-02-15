import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { Task } from '../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  taskToEdit: Task | null = null;
  filterStatus: string = 'all';
  sortOrder: string = 'newest';
  filteredTasks: Task[] = [];

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      if (this.filterStatus === 'completed') return task.completed;
      if (this.filterStatus === 'incomplete') return !task.completed;
      return true;
    });
    this.applySort();
  }

  applySort(): void {
    this.filteredTasks = this.filteredTasks.sort((a, b) => {
      return this.sortOrder === 'newest'
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  startEdit(task: Task): void {
    this.taskToEdit = { ...task };
  }

  handleTaskAdded(task: Task): void {
    this.taskService.addTask(task);
  }

  handleTaskUpdated(task: Task): void {
    this.taskService.updateTask(task);
    this.taskToEdit = null;
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to delete all tasks?')) {
      this.taskService.clearAllTasks();
    }
  }
}
