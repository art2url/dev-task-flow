import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  constructor(private http: HttpClient, private router: Router) {}

  onResetPassword(): void {
    if (!this.email) return;

    this.loading = true;
    this.http
      .post('https://dev-task-flow-auth-server.onrender.com/forgot-password', {
        email: this.email,
      })
      .subscribe({
        next: () => {
          alert('A password reset link has been sent to your email.');
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Failed to send reset link. Please try again.');
        },
        complete: () => (this.loading = false),
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onResetPassword();
    }
  }
}
