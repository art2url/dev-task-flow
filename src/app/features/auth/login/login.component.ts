import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.http
      .post<{ token: string }>(
        'https://dev-task-flow-auth-server.onrender.com/login',
        {
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
        },
      });
  }
}
