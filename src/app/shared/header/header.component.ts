import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() clearAllClicked = new EventEmitter<void>();
  @Output() loginClicked = new EventEmitter<void>();

  onToggleForm(): void {
    this.toggleForm.emit();
  }

  onClearAll(): void {
    this.clearAllClicked.emit();
  }

  onLogin(): void {
    this.loginClicked.emit();
  }
}
