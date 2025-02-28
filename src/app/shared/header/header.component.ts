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
  @Output() logout = new EventEmitter<void>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  get isAuthPage(): boolean {
    return (
      this.router.url.includes('/login') ||
      this.router.url.includes('/register')
    );
  }

  get title(): string {
    if (this.router.url.includes('/login')) return 'Login';
    if (this.router.url.includes('/register')) return 'Register';
    return 'DevTaskFlow - Task Manager';
  }

  get buttonLabel(): string {
    if (this.router.url.includes('/login')) return 'Register';
    if (this.router.url.includes('/register')) return 'Login';
    return localStorage.getItem('authToken') ? 'Logout' : 'Login';
  }

  onButtonClick(): void {
    if (this.router.url.includes('/login')) {
      this.router.navigate(['/register']);
    } else if (this.router.url.includes('/register')) {
      this.router.navigate(['/login']);
    } else {
      if (localStorage.getItem('authToken')) {
        localStorage.removeItem('authToken');
        this.logout.emit();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
