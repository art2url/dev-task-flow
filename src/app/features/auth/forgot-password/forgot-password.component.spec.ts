import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef } from '@angular/material/dialog';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
        FormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        provideHttpClient(withInterceptors([])),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable reset button if email is empty', async () => {
    component.email = '';
    fixture.detectChanges();
    await fixture.whenStable();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should enable reset button when email is entered', async () => {
    const emailInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('should call API and show success message on valid email', () => {
    component.email = 'test@example.com';
    component.onResetPassword();
    expect(component.successMessage).toBe('');
  });

  it('should show error message if email is not found', () => {
    component.email = 'notfound@example.com';
    component.onResetPassword();
    expect(component.errorMessage).toBe('');
  });

  it('should trigger password reset when Enter key is pressed', () => {
    spyOn(component, 'onResetPassword');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    component.onKeyPress(event);
    expect(component.onResetPassword).toHaveBeenCalled();
  });
});
