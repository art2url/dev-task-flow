import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const appRoutes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks' },
];
