import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ShowFormService } from '../services/show-form.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showForm = true;
  isMenuOpen = false;
  isSmallScreen = window.innerWidth <= 768;
  isAzureTheme = false;

  constructor(
    private router: Router,
    private showFormService: ShowFormService
  ) {
    this.showFormService.showForm$.subscribe(
      (value) => (this.showForm = value)
    );
    const savedTheme = localStorage.getItem('theme') || 'default-theme';
    document.documentElement.classList.remove(
      'azure-blue-theme',
      'default-theme'
    );
    document.documentElement.classList.add(savedTheme);

    this.isAzureTheme = savedTheme === 'azure-blue-theme';
  }

  get isAuthPage(): boolean {
    return ['/login', '/register', '/forgot-password'].some((path) =>
      this.router.url.includes(path)
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
    if (this.isAuthPage) {
      if (this.router.url.includes('/register')) {
        this.router.navigate(['/login']);
      } else if (this.router.url.includes('/forgot-password')) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/register']);
      }
    } else {
      localStorage.getItem('authToken')
        ? this.logout()
        : this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  toggleTaskForm(): void {
    this.showFormService.toggleForm();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(): void {
    const isAzureBlue =
      document.documentElement.classList.contains('azure-blue-theme');

    if (isAzureBlue) {
      document.documentElement.classList.remove('azure-blue-theme');
      document.documentElement.classList.add('default-theme');
      localStorage.setItem('theme', 'default-theme');
      this.isAzureTheme = false;
    } else {
      document.documentElement.classList.remove('default-theme');
      document.documentElement.classList.add('azure-blue-theme');
      localStorage.setItem('theme', 'azure-blue-theme');
      this.isAzureTheme = true;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }
}
