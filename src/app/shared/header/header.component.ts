import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
  @Output() clearAllClicked = new EventEmitter<void>();
  @Output() loginClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  onToggleForm(): void {
    this.toggleForm.emit();
  }

  onLogin(): void {
    this.loginClicked.emit();
  }
}
