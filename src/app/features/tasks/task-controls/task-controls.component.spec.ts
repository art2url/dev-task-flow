import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskControlsComponent } from './task-controls.component';
import { Task } from '../models/task.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  template: `<app-task-controls
    [tasks]="tasks"
    (filteredTasksChange)="onFilteredTasks($event)"
  ></app-task-controls>`,
})
class TestHostComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  onFilteredTasks(filteredTasks: Task[]) {
    this.filteredTasks = filteredTasks;
  }
}

describe('TaskControlsComponent via TestHost', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let taskControlsComponent: TaskControlsComponent;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [
        TaskControlsComponent,
        FormsModule,
        CommonModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    testHost = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const debugEl = hostFixture.debugElement.query(
      By.directive(TaskControlsComponent)
    );
    expect(debugEl).toBeTruthy();
    taskControlsComponent = debugEl.componentInstance;
  });

  it('should create the task controls component', () => {
    expect(taskControlsComponent).toBeTruthy();
  });

  it('should emit filtered tasks when filter changes', () => {
    testHost.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        completed: true,
        priority: 'Low',
        createdAt: new Date(),
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.filterStatus = 'completed';
    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks.length).toBe(1);
    expect(testHost.filteredTasks[0].title).toBe('Task 2');
  });

  it('should filter tasks by search query', () => {
    testHost.tasks = [
      {
        _id: '1',
        title: 'Important Task',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Normal Task',
        completed: false,
        priority: 'Medium',
        createdAt: new Date(),
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.searchQuery = 'important';
    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks.length).toBe(1);
    expect(testHost.filteredTasks[0].title).toBe('Important Task');
  });

  it('should sort tasks by priority', () => {
    testHost.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        priority: 'Low',
        completed: false,
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        priority: 'High',
        completed: false,
        createdAt: new Date(),
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.prioritySortOrder = 'priority-high';
    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks[0].priority).toBe('High');
    expect(testHost.filteredTasks[1].priority).toBe('Low');
  });

  it('should sort tasks by date', () => {
    const date1 = new Date();
    const date2 = new Date(date1.getTime() - 86400000);

    testHost.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        createdAt: date1,
        priority: 'Medium',
        completed: false,
      },
      {
        _id: '2',
        title: 'Task 2',
        createdAt: date2,
        priority: 'Medium',
        completed: false,
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.dateSortOrder = 'newest';
    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks[0].title).toBe('Task 1');
    expect(testHost.filteredTasks[1].title).toBe('Task 2');
  });

  it('should pin tasks first', () => {
    testHost.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        pinned: false,
        createdAt: new Date(),
        priority: 'Medium',
        completed: false,
      },
      {
        _id: '2',
        title: 'Task 2',
        pinned: true,
        createdAt: new Date(),
        priority: 'Medium',
        completed: false,
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks[0].pinned).toBeTrue();
  });

  it('should filter overdue tasks', () => {
    const pastDate = new Date(Date.now() - 86400000);
    const futureDate = new Date(Date.now() + 86400000);

    testHost.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        deadline: pastDate,
        completed: false,
        priority: 'Medium',
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        deadline: futureDate,
        completed: false,
        priority: 'Medium',
        createdAt: new Date(),
      },
    ];
    hostFixture.detectChanges();

    taskControlsComponent.filterStatus = 'overdue';
    taskControlsComponent.onFilterChanged();
    hostFixture.detectChanges();

    expect(testHost.filteredTasks.length).toBe(1);
    expect(testHost.filteredTasks[0].title).toBe('Task 1');
  });
});
