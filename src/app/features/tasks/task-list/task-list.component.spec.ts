import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../task.service';
import { ShowFormService } from '../../../shared/services/show-form.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockTaskService {
  tasks$ = new BehaviorSubject<Task[]>([]);
  fetchTasks = jasmine.createSpy('fetchTasks');
  togglePin = jasmine.createSpy('togglePin');
  addTask = jasmine.createSpy('addTask');
  updateTask = jasmine.createSpy('updateTask');
  deleteTask = jasmine.createSpy('deleteTask');
  toggleTaskCompletion = jasmine.createSpy('toggleTaskCompletion');
  clearAllTasks = jasmine.createSpy('clearAllTasks');
}

class MockShowFormService {
  showForm$ = new BehaviorSubject<boolean>(true);
}

const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
matDialogSpy.open.and.returnValue({
  afterClosed: () => of(true),
} as unknown as MatDialogRef<unknown, unknown>);

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: MockTaskService;
  let showFormService: MockShowFormService;
  let router: jasmine.SpyObj<Router>;

  const validToken =
    'dummyHeader.' +
    btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60000 })) +
    '.dummySignature';

  beforeEach(async () => {
    localStorage.setItem('authToken', validToken);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ShowFormService, useClass: MockShowFormService },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideProvider(MatDialog, { useValue: matDialogSpy })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as unknown as MockTaskService;
    showFormService = TestBed.inject(
      ShowFormService
    ) as unknown as MockShowFormService;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /login if authToken is missing or expired', () => {
    localStorage.removeItem('authToken');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call fetchTasks on init if token is valid', () => {
    component.ngOnInit();
    expect(taskService.fetchTasks).toHaveBeenCalled();
  });

  it('should update showForm when ShowFormService emits a new value', fakeAsync(() => {
    fixture.detectChanges();
    showFormService.showForm$.next(false);
    tick();
    fixture.detectChanges();
    expect(component.showForm).toBe(false);
    flush();
  }));

  it('should update tasks and calculate progress when TaskService.tasks$ emits', fakeAsync(() => {
    fixture.detectChanges();

    const tasks: Task[] = [
      {
        _id: '1',
        title: 'Task 1',
        completed: true,
        priority: 'Low',
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      },
    ];
    taskService.tasks$.next(tasks);
    tick(1000);
    fixture.detectChanges();

    expect(component.tasks.length).toBe(2);
    expect(component.progress).toBe(50);
    expect(component.isLoading).toBeFalse();
    flush();
  }));

  it('onFilteredTasksChange should reset pageIndex and update paginated tasks', () => {
    spyOn(component, 'updatePaginatedTasks');
    const newList: Task[] = [
      {
        _id: '3',
        title: 'Task 3',
        completed: false,
        priority: 'Medium',
        createdAt: new Date(),
      },
    ];
    component.onFilteredTasksChange(newList);
    expect(component.pageIndex).toBe(0);
    expect(component.updatePaginatedTasks).toHaveBeenCalled();
  });

  it('togglePin should call taskService.togglePin', () => {
    const task: Task = {
      _id: '1',
      title: 'Task 1',
      completed: false,
      priority: 'Low',
      createdAt: new Date(),
    };
    component.togglePin(task);
    expect(taskService.togglePin).toHaveBeenCalledWith(task);
  });

  it('calculateProgress should compute correct progress', () => {
    component.tasks = [
      {
        _id: '1',
        title: 'Task 1',
        completed: true,
        priority: 'Low',
        createdAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      },
      {
        _id: '3',
        title: 'Task 3',
        completed: true,
        priority: 'Medium',
        createdAt: new Date(),
      },
    ];
    component.calculateProgress();
    expect(component.progress).toBeCloseTo((2 / 3) * 100);
  });

  it('handleTaskAdded should call taskService.addTask', () => {
    const newTask: Task = {
      _id: '4',
      title: 'New Task',
      completed: false,
      priority: 'High',
      createdAt: new Date(),
    };
    component.handleTaskAdded(newTask);
    expect(taskService.addTask).toHaveBeenCalledWith(newTask);
  });

  it('handleTaskUpdated should call taskService.updateTask and reset taskToEdit', () => {
    const updatedTask: Task = {
      _id: '5',
      title: 'Updated Task',
      completed: false,
      priority: 'Medium',
      createdAt: new Date(),
    };
    component.taskToEdit = { ...updatedTask };
    component.handleTaskUpdated(updatedTask);
    expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask);
    expect(component.taskToEdit).toBeNull();
  });

  it('startEdit should set taskToEdit to a copy of the provided task', () => {
    const task: Task = {
      _id: '6',
      title: 'Edit Task',
      completed: false,
      priority: 'Low',
      createdAt: new Date(),
    };
    component.startEdit(task);
    expect(component.taskToEdit).toEqual(task);
    expect(component.taskToEdit).not.toBe(task);
  });

  it('deleteTask should call taskService.deleteTask', () => {
    component.deleteTask('7');
    expect(taskService.deleteTask).toHaveBeenCalledWith('7');
  });

  it('toggleTaskCompletion should call taskService.toggleTaskCompletion', () => {
    const task: Task = {
      _id: '8',
      title: 'Complete Task',
      completed: false,
      priority: 'High',
      createdAt: new Date(),
    };
    component.toggleTaskCompletion(task);
    expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith(task);
  });

  it('onPageChange should update pageIndex and pageSize and call updatePaginatedTasks', () => {
    spyOn(component, 'updatePaginatedTasks');
    const event = { pageIndex: 1, pageSize: 12 };
    component.onPageChange(event);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(12);
    expect(component.updatePaginatedTasks).toHaveBeenCalled();
  });

  it('updatePaginatedTasks should slice filteredTasksOriginal based on pageIndex and pageSize', () => {
    const tasks: Task[] = [];
    for (let i = 0; i < 20; i++) {
      tasks.push({
        _id: `${i}`,
        title: `Task ${i}`,
        completed: false,
        priority: 'Low',
        createdAt: new Date(),
      });
    }
    component.filteredTasksOriginal = tasks;
    component.pageIndex = 1;
    component.pageSize = 6;
    component.updatePaginatedTasks();
    expect(component.filteredTasks.length).toBe(6);
    expect(component.filteredTasks[0]._id).toBe('6');
  });

  it('isOverdue should return true if task.deadline is past and task is not completed', () => {
    const pastDate = new Date(Date.now() - 100000);
    const futureDate = new Date(Date.now() + 100000);
    const overdueTask: Task = {
      _id: '9',
      title: 'Overdue',
      completed: false,
      priority: 'High',
      createdAt: new Date(),
      deadline: pastDate,
    };
    const notOverdueTask: Task = {
      _id: '10',
      title: 'Not Overdue',
      completed: false,
      priority: 'High',
      createdAt: new Date(),
      deadline: futureDate,
    };
    expect(component.isOverdue(overdueTask)).toBeTrue();
    expect(component.isOverdue(notOverdueTask)).toBeFalse();
  });

  it('clearAllTasks should call taskService.clearAllTasks', () => {
    component.clearAllTasks();
    expect(taskService.clearAllTasks).toHaveBeenCalled();
  });

  it('openDeleteConfirmationDialog should open a dialog and clear tasks if confirmed', fakeAsync(() => {
    component.openDeleteConfirmationDialog();
    tick();
    expect(taskService.clearAllTasks).toHaveBeenCalled();
  }));

  it('trackByTaskId should return task._id', () => {
    const task: Task = {
      _id: '11',
      title: 'Track Task',
      completed: false,
      priority: 'Low',
      createdAt: new Date(),
    };
    const result = component.trackByTaskId(0, task);
    expect(result).toBe('11');
  });

  it('checkScreenSize should update isWideScreen based on window.innerWidth', () => {
    const innerWidthSpy = spyOnProperty(
      window,
      'innerWidth',
      'get'
    ).and.returnValue(500);
    component.checkScreenSize();
    expect(component.isWideScreen).toBeFalse();
    innerWidthSpy.and.returnValue(600);
    component.checkScreenSize();
    expect(component.isWideScreen).toBeTrue();
  });

  it('ngOnDestroy should complete the destroy$ subject', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
