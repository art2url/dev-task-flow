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

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  title = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.title = this.taskToEdit.title;
    }
  }

  saveTask() {
    if (!this.title.trim()) return;

    if (this.taskToEdit) {
      this.taskUpdated.emit({
        ...this.taskToEdit,
        title: this.title,
      });
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: this.title,
        completed: false,
        createdAt: new Date(),
      };
      this.taskAdded.emit(newTask);
    }

    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.taskToEdit = null;
  }
}
