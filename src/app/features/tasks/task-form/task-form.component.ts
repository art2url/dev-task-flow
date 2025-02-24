import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  title = '';
  description = '';
  priority: 'Low' | 'Medium' | 'High' = 'Medium';
  deadline: Date | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.title = this.taskToEdit.title;
      this.description = this.taskToEdit.description || '';
      this.deadline = this.taskToEdit.deadline
        ? new Date(this.taskToEdit.deadline)
        : null;
    }
  }

  saveTask() {
    if (!this.title.trim()) return;

    const updatedTask: Task = {
      id: this.taskToEdit ? this.taskToEdit.id : Date.now(),
      title: this.title,
      description: this.description, // Include updated description
      completed: this.taskToEdit ? this.taskToEdit.completed : false,
      createdAt: this.taskToEdit ? this.taskToEdit.createdAt : new Date(),
      priority: this.priority,
      deadline: this.deadline || null,
    };

    this.taskToEdit
      ? this.taskUpdated.emit(updatedTask)
      : this.taskAdded.emit(updatedTask);

    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.priority = 'Medium';
    this.deadline = null;
    this.taskToEdit = null;
  }
}
