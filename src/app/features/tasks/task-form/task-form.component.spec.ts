import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskFormComponent } from './task-form.component';
import { Task } from '../models/task.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [TaskFormComponent],
  template: `<app-task-form
    (taskAdded)="onTaskAdded($event)"
    (taskUpdated)="onTaskUpdated($event)"
  ></app-task-form>`,
})
class TestHostComponent {
  taskAdded: Task | null = null;
  taskUpdated: Task | null = null;

  onTaskAdded(task: Task) {
    this.taskAdded = task;
  }

  onTaskUpdated(task: Task) {
    this.taskUpdated = task;
  }
}

describe('TaskFormComponent via TestHost', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let taskFormComponent: TaskFormComponent;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TaskFormComponent,
        FormsModule,
        CommonModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    testHost = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const debugEl = hostFixture.debugElement.query(
      By.directive(TaskFormComponent)
    );
    taskFormComponent = debugEl.componentInstance;
  });

  it('should create the task form component', () => {
    expect(taskFormComponent).toBeTruthy();
  });

  it('should disable "Add Task" button when title is empty', async () => {
    await hostFixture.whenStable();
    taskFormComponent.title = '';
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    const titleInput: HTMLInputElement =
      hostFixture.nativeElement.querySelector('input[name="title"]');
    titleInput.value = '';
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    titleInput.dispatchEvent(new Event('blur', { bubbles: true }));
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    const addButton: HTMLButtonElement =
      hostFixture.nativeElement.querySelector(
        'button[mat-flat-button][color="primary"]'
      );
    expect(addButton.disabled).toBeTrue();
  });

  it('should enable "Add Task" button when title is filled', async () => {
    taskFormComponent.title = 'New Task';
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    const addButton: HTMLButtonElement =
      hostFixture.nativeElement.querySelector('button');
    expect(addButton.disabled).toBeFalse();
  });

  it('should emit "taskAdded" when a new task is added', () => {
    spyOn(taskFormComponent, 'resetForm').and.callFake(() => {});
    taskFormComponent.title = 'Test Task';
    taskFormComponent.description = 'Task Description';
    taskFormComponent.priority = 'Medium';
    taskFormComponent.deadline = new Date();
    hostFixture.detectChanges();
    taskFormComponent.saveTask({ form: { valid: true } } as NgForm);
    hostFixture.detectChanges();
    expect(testHost.taskAdded).toBeTruthy();
    expect(testHost.taskAdded?.title).toBe('Test Task');
  });

  it('should reset the form after adding a task', async () => {
    spyOn(taskFormComponent, 'resetForm').and.callThrough();
    taskFormComponent.title = 'Reset Task';
    taskFormComponent.description = 'Should be cleared';
    taskFormComponent.priority = 'High';
    taskFormComponent.deadline = new Date();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    taskFormComponent.saveTask(taskFormComponent.taskForm);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    expect(taskFormComponent.resetForm).toHaveBeenCalled();
    expect(taskFormComponent.title).toBe('');
    expect(taskFormComponent.description).toBe('');
    expect(taskFormComponent.priority).toBe('Low');
    expect(taskFormComponent.deadline).toBeNull();
  });

  it('should toggle form visibility', () => {
    expect(taskFormComponent.showForm).toBeTrue();
    taskFormComponent.toggleFormVisibility();
    expect(taskFormComponent.showForm).toBeFalse();
  });
});
