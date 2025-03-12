import { TaskService } from './task.service';
import { Task } from './models/task.model';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = 'https://dev-task-flow-auth-server.onrender.com/tasks';

  const validToken =
    'dummyHeader.' +
    btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60000 })) +
    '.dummySignature';

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'put',
      'post',
      'delete',
    ]);
    httpClientSpy.get.and.returnValue(of([]));

    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'authToken' ? validToken : null
    );
    spyOn(localStorage, 'removeItem').and.callFake(() => {});

    spyOn(TaskService.prototype as any, 'handleUnauthorized').and.callFake(
      function (this: TaskService) {
        localStorage.removeItem('authToken');
      }
    );

    spyOn(console, 'error');

    service = new TaskService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchTasks', () => {
    it('should handle unauthorized (expired token) by removing the token and calling handleUnauthorized', () => {
      const expiredToken =
        'dummyHeader.' +
        btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 })) +
        '.dummySignature';
      (localStorage.getItem as jasmine.Spy).and.returnValue(expiredToken);

      service.fetchTasks();

      expect((service as any).handleUnauthorized).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('togglePin', () => {
    const sampleTask: Task = {
      _id: '1',
      title: 'Test Task',
      completed: false,
      priority: 'Medium',
      createdAt: new Date(),
      pinned: false,
    };

    beforeEach(() => {
      (service as any).tasksSubject.next([sampleTask]);
    });

    it('should toggle pin value and call http.put', () => {
      httpClientSpy.put.and.returnValue(of({}));

      service.togglePin(sampleTask);

      const updatedTask = (service as any).tasksSubject.value.find(
        (t: Task) => t._id === sampleTask._id
      );
      expect(updatedTask.pinned).toBe(true);
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${apiUrl}/${sampleTask._id}`,
        jasmine.objectContaining({ pinned: true }),
        jasmine.any(Object)
      );
    });

    it('should refetch tasks on http.put error', () => {
      httpClientSpy.put.and.returnValue(throwError(() => ({ status: 500 })));
      spyOn(service, 'fetchTasks');

      service.togglePin(sampleTask);
      expect(service.fetchTasks).toHaveBeenCalled();
    });
  });

  describe('addTask', () => {
    it('should add a task and update tasksSubject', () => {
      const newTask: Task = {
        _id: '2',
        title: 'New Task',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      };
      httpClientSpy.post.and.returnValue(of(newTask));

      (service as any).tasksSubject.next([]);

      service.addTask(newTask);

      service.tasks$.subscribe((tasks) => {
        expect(tasks.find((t: Task) => t._id === newTask._id)).toEqual(newTask);
      });
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        apiUrl,
        newTask,
        jasmine.any(Object)
      );
    });

    it('should refetch tasks on http.post error', () => {
      httpClientSpy.post.and.returnValue(throwError(() => ({ status: 500 })));
      spyOn(service, 'fetchTasks');

      service.addTask({
        _id: '2',
        title: 'New Task',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      });
      expect(service.fetchTasks).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update a task and refetch tasks on success', () => {
      const updatedTask: Task = {
        _id: '1',
        title: 'Updated Task',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      };
      httpClientSpy.put.and.returnValue(of({}));
      httpClientSpy.get.and.returnValue(of([updatedTask]));

      service.updateTask(updatedTask);

      // updateTask calls fetchTasks on success.
      expect(httpClientSpy.get).toHaveBeenCalled();
      service.tasks$.subscribe((tasks) => {
        expect(tasks).toEqual([updatedTask]);
      });
    });

    it('should refetch tasks on http.put error', () => {
      httpClientSpy.put.and.returnValue(throwError(() => ({ status: 500 })));
      spyOn(service, 'fetchTasks');

      service.updateTask({
        _id: '1',
        title: 'Updated Task',
        completed: false,
        priority: 'High',
        createdAt: new Date(),
      });
      expect(service.fetchTasks).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    const task1: Task = {
      _id: '1',
      title: 'Task 1',
      completed: false,
      priority: 'Low',
      createdAt: new Date(),
    };
    const task2: Task = {
      _id: '2',
      title: 'Task 2',
      completed: false,
      priority: 'Medium',
      createdAt: new Date(),
    };

    beforeEach(() => {
      (service as any).tasksSubject.next([task1, task2]);
    });

    it('should delete a task and update tasksSubject', () => {
      httpClientSpy.delete.and.returnValue(of({}));

      service.deleteTask('1');

      const tasks = (service as any).tasksSubject.value;
      expect(tasks.length).toBe(1);
      expect(tasks[0]._id).toBe('2');
      expect(httpClientSpy.delete).toHaveBeenCalledWith(
        `${apiUrl}/1`,
        jasmine.any(Object)
      );
    });

    it('should revert tasksSubject on http.delete error', () => {
      const originalTasks = [task1, task2];
      (service as any).tasksSubject.next([...originalTasks]);
      httpClientSpy.delete.and.returnValue(throwError(() => ({ status: 500 })));

      service.deleteTask('1');

      expect((service as any).tasksSubject.value).toEqual(originalTasks);
    });
  });

  describe('clearAllTasks', () => {
    it('should clear all tasks on success', () => {
      (service as any).tasksSubject.next([
        {
          _id: '1',
          title: 'Task 1',
          completed: false,
          priority: 'Low',
          createdAt: new Date(),
        },
      ]);
      httpClientSpy.delete.and.returnValue(of({}));

      service.clearAllTasks();

      service.tasks$.subscribe((tasks) => {
        expect(tasks).toEqual([]);
      });
      expect(httpClientSpy.delete).toHaveBeenCalledWith(
        apiUrl,
        jasmine.any(Object)
      );
    });

    it('should refetch tasks on http.delete error', () => {
      httpClientSpy.delete.and.returnValue(throwError(() => ({ status: 500 })));
      spyOn(service, 'fetchTasks');

      service.clearAllTasks();
      expect(service.fetchTasks).toHaveBeenCalled();
    });
  });

  describe('trackByTaskId', () => {
    it('should return the task _id', () => {
      const task: Task = {
        _id: '123',
        title: 'Some Task',
        completed: false,
        priority: 'Low',
        createdAt: new Date(),
      };
      const result = service.trackByTaskId(0, task);
      expect(result).toBe('123');
    });
  });
});
