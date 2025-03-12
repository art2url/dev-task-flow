import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';
import { NgForm } from '@angular/forms';

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
  @ViewChild('taskForm') taskForm!: NgForm;
  @Input() taskToEdit: Task | null = null;
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  title = '';
  description = '';
  priority: 'Low' | 'Medium' | 'High' = 'Low';
  deadline: Date | null = null;
  showForm: boolean = true;

  toggleFormVisibility(): void {
    this.showForm = !this.showForm;

    if (this.taskForm) {
      setTimeout(() => {
        this.taskForm.resetForm({
          title: this.title,
          description: this.description,
          priority: this.priority,
          deadline: this.deadline,
        });
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.showForm = true;
      this.title = this.taskToEdit.title;
      this.description = this.taskToEdit.description || '';
      this.priority = this.taskToEdit.priority;
      this.deadline = this.taskToEdit.deadline
        ? new Date(this.taskToEdit.deadline)
        : null;
    }
  }

  saveTask(taskForm: NgForm) {
    if (!this.title.trim()) return;

    const isEditMode = !!this.taskToEdit;

    const task: Task = {
      _id: isEditMode ? this.taskToEdit!._id : Date.now().toString(),
      title: this.title,
      description: this.description,
      completed: isEditMode ? this.taskToEdit!.completed : false,
      createdAt: isEditMode ? this.taskToEdit!.createdAt : new Date(),
      priority: this.priority,
      deadline: this.deadline || null,
    };

    this[isEditMode ? 'taskUpdated' : 'taskAdded'].emit(task);
    this.resetForm(taskForm);
  }

  resetForm(taskForm: NgForm) {
    taskForm.resetForm();
    this.title = '';
    this.description = '';
    this.priority = 'Low';
    this.deadline = null;
    this.taskToEdit = null;
  }
}
