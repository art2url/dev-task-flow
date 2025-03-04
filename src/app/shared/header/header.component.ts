import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showForm: boolean = true;
  @Output() toggleForm = new EventEmitter<void>();

  isMenuOpen = false;
  isSmallScreen = window.innerWidth <= 768;

  constructor(private router: Router) {}

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(): void {
    console.log('Theme toggle clicked! (To be implemented)');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }
}
