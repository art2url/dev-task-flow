import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ConfirmDialogComponent } from '../../tasks/confirm-dialog/confirm-dialog.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  onResetPassword(): void {
    if (!this.email) return;

    this.loading = true;
    this.http
      .post<{ message: string }>(
        'https://dev-task-flow-auth-server.onrender.com/forgot-password',
        { email: this.email }
      )
      .subscribe({
        next: (response) => {
          this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
              title: 'New Password Sent',
              message: response.message,
            },
          });
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'User not found. Please check your email.';
          this.loading = false;
        },
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onResetPassword();
    }
  }
}
