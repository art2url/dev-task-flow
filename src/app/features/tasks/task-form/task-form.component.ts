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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.title = this.taskToEdit.title;
      this.description = this.taskToEdit.description || ''; // Load description if available
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
    };

    this.taskToEdit
      ? this.taskUpdated.emit(updatedTask)
      : this.taskAdded.emit(updatedTask);

    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = ''; // Clear description
    this.taskToEdit = null;
  }
}
