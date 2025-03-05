import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowFormService {
  private showFormSubject = new BehaviorSubject<boolean>(true);
  showForm$ = this.showFormSubject.asObservable();

  toggleForm(): void {
    this.showFormSubject.next(!this.showFormSubject.value);
  }
}
