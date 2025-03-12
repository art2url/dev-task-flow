import { TestBed } from '@angular/core/testing';
import { ShowFormService } from './show-form.service';

describe('ShowFormService', () => {
  let service: ShowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowFormService],
    });
    service = TestBed.inject(ShowFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial showForm$ value of true', (done) => {
    service.showForm$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should toggle showForm$ value when toggleForm() is called', (done) => {
    const emittedValues: boolean[] = [];

    service.showForm$.subscribe((value) => {
      emittedValues.push(value);

      if (emittedValues.length === 2) {
        expect(emittedValues).toEqual([true, false]); // First value true, then false after toggle
        done();
      }
    });

    service.toggleForm(); // This should emit `false`
  });

  it('should toggle showForm$ back to true when toggleForm() is called twice', (done) => {
    const emittedValues: boolean[] = [];

    service.showForm$.subscribe((value) => {
      emittedValues.push(value);

      if (emittedValues.length === 3) {
        expect(emittedValues).toEqual([true, false, true]); // First true, then false, then true
        done();
      }
    });

    service.toggleForm(); // Emits `false`
    service.toggleForm(); // Emits `true`
  });
});
