import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<Task>();

  title = '';

  addTask() {
    if (this.title.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: this.title,
        completed: false,
        createdAt: new Date(),
      };
      this.taskAdded.emit(newTask);
      this.title = '';
    }
  }
}
