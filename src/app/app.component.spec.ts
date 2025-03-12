import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent, FooterComponent, RouterOutlet],
    }).compileComponents();
  });

  beforeEach(() => {
    document.body.classList.remove('azure-blue-theme');
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the title "DevTaskFlow"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DevTaskFlow');
  });

  it('should apply the azure-blue theme if stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('azure-blue');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(document.body.classList.contains('azure-blue-theme')).toBeTrue();
  });

  it('should not apply the azure-blue theme if it is not stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(document.body.classList.contains('azure-blue-theme')).toBeFalse();
  });

  it('should render the header, main content, and footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('app-footer')).not.toBeNull();
  });
});
