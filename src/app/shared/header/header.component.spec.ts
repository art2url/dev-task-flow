import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ShowFormService } from '../services/show-form.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let showFormServiceSpy: jasmine.SpyObj<ShowFormService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    showFormServiceSpy = jasmine.createSpyObj(
      'ShowFormService',
      ['toggleForm'],
      { showForm$: of(true) }
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/' });

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
      ],
      providers: [
        { provide: ShowFormService, useValue: showFormServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showForm from service', () => {
    expect(component.showForm).toBeTrue();
  });

  it('should call toggleForm on ShowFormService when toggleTaskForm is called', () => {
    component.toggleTaskForm();
    expect(showFormServiceSpy.toggleForm).toHaveBeenCalled();
  });

  it('should toggle menu state when toggleMenu() is called', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
  });

  it('should set correct button label when user is authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue('valid-token');
    expect(component.buttonLabel).toBe('Logout');
  });

  it('should set correct button label when user is not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(component.buttonLabel).toBe('Login');
  });

  it('should navigate to /login when Logout button is clicked', () => {
    spyOn(localStorage, 'getItem').and.returnValue('valid-token');
    spyOn(localStorage, 'removeItem');

    component.onButtonClick();

    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /login when login button is clicked', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.onButtonClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle theme correctly', () => {
    document.documentElement.classList.add('azure-blue-theme');
    localStorage.setItem('theme', 'azure-blue-theme');
    component.toggleTheme();
    expect(
      document.documentElement.classList.contains('azure-blue-theme')
    ).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('default-theme');
  });

  it('should toggle theme back to azure-blue-theme', () => {
    document.documentElement.classList.remove('azure-blue-theme');
    localStorage.setItem('theme', 'default-theme');
    component.toggleTheme();
    expect(
      document.documentElement.classList.contains('azure-blue-theme')
    ).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('azure-blue-theme');
  });

  it('should update isSmallScreen on window resize', () => {
    component.isSmallScreen = false;
    spyOnProperty(window, 'innerWidth').and.returnValue(600);
    window.dispatchEvent(new Event('resize'));
    expect(component.isSmallScreen).toBeTrue();
  });
});
