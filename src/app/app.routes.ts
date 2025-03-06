import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const appRoutes: Routes = [
  // Protected Task Management Route
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },

  // Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Default redirect to tasks
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },

  // Wildcard route redirects to tasks
  { path: '**', redirectTo: 'tasks' },
];
