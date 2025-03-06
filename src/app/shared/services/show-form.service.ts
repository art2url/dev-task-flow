import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowFormService {
  private showFormSubject = new BehaviorSubject<boolean>(true);

  get showForm$(): Observable<boolean> {
    return this.showFormSubject.asObservable();
  }

  toggleForm(): void {
    this.showFormSubject.next(!this.showFormSubject.value);
  }
}
