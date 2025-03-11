import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModule, Directive, Input, Component } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  function updateInput(selector: string, value: string) {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector(selector);
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
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
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    })

      .overrideComponent(RegisterComponent, {
        set: {
          imports: [
            CommonModule,
            FormsModule,
            RouterLinkStubModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatProgressSpinnerModule,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Verify that no unexpected HTTP requests remain.
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the register button if the form is invalid', async () => {
    // Clear inputs by simulating user input.
    updateInput('input[name="username"]', '');
    updateInput('input[name="email"]', '');
    updateInput('input[name="password"]', '');
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });

  it('should enable the register button when the form is valid', async () => {
    // Simulate user input for each field.
    updateInput('input[name="username"]', 'testuser');
    updateInput('input[name="email"]', 'test@example.com');
    updateInput('input[name="password"]', 'password123');
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalse();
  });

  it('should call the API and navigate to /login on successful registration', () => {
    // Simulate valid user input.
    updateInput('input[name="username"]', 'testuser');
    updateInput('input[name="email"]', 'test@example.com');
    updateInput('input[name="password"]', 'password123');
    fixture.detectChanges();

    component.onRegister();

    // Expect an HTTP POST to the registration endpoint.
    const req = httpTestingController.expectOne(
      'https://dev-task-flow-auth-server.onrender.com/register'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Simulate a successful response.
    req.flush({});

    // Assert that after success, navigation to '/login' occurs.
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error message and reset loading if registration fails', () => {
    updateInput('input[name="username"]', 'baduser');
    updateInput('input[name="email"]', 'bad@example.com');
    updateInput('input[name="password"]', 'short');
    fixture.detectChanges();

    component.onRegister();

    const req = httpTestingController.expectOne(
      'https://dev-task-flow-auth-server.onrender.com/register'
    );
    expect(req.request.method).toBe('POST');

    // Flush an error response with the expected shape so that err.error.error is 'Registration failed'.
    req.flush(
      { error: 'Registration failed' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(component.errorMessage).toBe('Registration failed');
    expect(component.loading).toBeFalse();
  });

  it('should trigger registration when the Enter key is pressed', () => {
    spyOn(component, 'onRegister');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    component.onKeyPress(event);
    expect(component.onRegister).toHaveBeenCalled();
  });
});
