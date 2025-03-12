import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Directive, Input, NgModule } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkStubDirective {
  @Input() routerLink: any;
}

@NgModule({
  declarations: [RouterLinkStubDirective],
  exports: [RouterLinkStubDirective],
})
export class RouterLinkStubModule {}

@Component({
  selector: 'mat-spinner',
  template: '<div></div>',
})
export class MatSpinnerStub {}

@Component({
  template: `<app-login></app-login>`,
})
class TestHostComponent {}

describe('LoginComponent via TestHost', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let loginComponent: LoginComponent;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  function updateInput(selector: string, value: string) {
    const inputEl: HTMLInputElement =
      hostFixture.nativeElement.querySelector(selector);
    inputEl.value = value;
    inputEl.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({ token: 'fake-token' }));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, MatSpinnerStub],
      imports: [
        LoginComponent,
        FormsModule,
        CommonModule,
        NoopAnimationsModule,
        RouterLinkStubModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDividerModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    })
      .overrideComponent(LoginComponent, {
        set: {
          imports: [
            CommonModule,
            FormsModule,
            NoopAnimationsModule,
            RouterLinkStubModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatProgressSpinnerModule,
            MatDividerModule,
          ],
        },
      })
      .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const loginDebugEl = hostFixture.debugElement.query(
      By.directive(LoginComponent)
    );
    expect(loginDebugEl).toBeTruthy();
    loginComponent = loginDebugEl.componentInstance;
  });

  it('should create the login component', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('should disable login button if form is invalid', async () => {
    updateInput('input[name="email"]', '');
    updateInput('input[name="password"]', '');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    const button: HTMLButtonElement =
      hostFixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should enable login button when email and password are entered', async () => {
    updateInput('input[name="email"]', 'test@example.com');
    updateInput('input[name="password"]', 'password123');
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    const button: HTMLButtonElement =
      hostFixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('should call API and navigate to tasks on successful login', () => {
    updateInput('input[name="email"]', 'test@example.com');
    updateInput('input[name="password"]', 'password123');
    hostFixture.detectChanges();
    loginComponent.onLogin();

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'https://dev-task-flow-auth-server.onrender.com/login',
      { email: 'test@example.com', password: 'password123' }
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show error message if login fails', () => {
    httpClientSpy.post.and.returnValue(
      throwError(() => new Error('Login failed'))
    );
    updateInput('input[name="email"]', 'wrong@example.com');
    updateInput('input[name="password"]', 'wrongpassword');
    hostFixture.detectChanges();
    loginComponent.onLogin();

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'https://dev-task-flow-auth-server.onrender.com/login',
      { email: 'wrong@example.com', password: 'wrongpassword' }
    );
    expect(loginComponent.errorMessage).toBe(
      'Password or email does not match.'
    );
    expect(loginComponent.loading).toBeFalse();
  });

  it('should trigger login when Enter key is pressed', () => {
    spyOn(loginComponent, 'onLogin');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    loginComponent.onKeyPress(event);
    expect(loginComponent.onLogin).toHaveBeenCalled();
  });
});
