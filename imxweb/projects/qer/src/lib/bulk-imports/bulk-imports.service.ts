import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BulkImportsService {

  constructor() { }

  private isButtonEnabledSubject = new BehaviorSubject<boolean>(false);
  isButtonEnabled$: Observable<boolean> = this.isButtonEnabledSubject.asObservable();

  enableButton() {
    this.isButtonEnabledSubject.next(true);
  }

  disableButton() {
    this.isButtonEnabledSubject.next(false);
  }

}
