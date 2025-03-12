import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, MatIconModule, MatDividerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-text')?.textContent).toContain(
      '© 2024 DevTaskFlow. All rights reserved.'
    );
  });

  it('should contain a GitHub link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubLink = compiled.querySelector(
      'a[href="https://github.com/art2url"]'
    );
    expect(githubLink).toBeTruthy();
    expect(githubLink?.getAttribute('target')).toBe('_blank');
  });

  it('should contain a LinkedIn link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const linkedInLink = compiled.querySelector(
      'a[href="https://www.linkedin.com/in/artem-turlenko"]'
    );
    expect(linkedInLink).toBeTruthy();
    expect(linkedInLink?.getAttribute('target')).toBe('_blank');
  });

  it('should contain icons for GitHub and LinkedIn', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.footer-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].textContent?.trim()).toBe('code'); // GitHub icon
    expect(icons[1].textContent?.trim()).toBe('business_center'); // LinkedIn icon
  });
});
