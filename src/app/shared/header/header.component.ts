import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showForm: boolean = true;
  @Output() toggleForm = new EventEmitter<void>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  get isAuthPage(): boolean {
    return (
      this.router.url.includes('/login') ||
      this.router.url.includes('/register') ||
      this.router.url.includes('/forgot-password')
    );
  }

  get title(): string {
    if (this.router.url.includes('/login')) return 'DevTaskFlow - Login';
    if (this.router.url.includes('/register')) return 'DevTaskFlow - Register';
    if (this.router.url.includes('/forgot-password'))
      return 'DevTaskFlow - Forgot Password';
    return 'DevTaskFlow - Task Manager';
  }

  get buttonLabel(): string {
    if (this.router.url.includes('/login')) return 'Register';
    if (this.router.url.includes('/register')) return 'Login';
    if (this.router.url.includes('/forgot-password')) return 'Back to Login';
    return localStorage.getItem('authToken') ? 'Logout' : 'Login';
  }

  onButtonClick(): void {
    if (this.router.url.includes('/login')) {
      this.router.navigate(['/register']);
    } else if (this.router.url.includes('/register')) {
      this.router.navigate(['/login']);
    } else if (this.router.url.includes('/forgot-password')) {
      this.router.navigate(['/login']);
    } else {
      if (localStorage.getItem('authToken')) {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
