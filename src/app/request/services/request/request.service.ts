import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private _option: number = 0;
  private optionSubject = new Subject<number>();

  constructor() { }

  get option(): number { return this._option; }
  get getOption(): Observable<number> { return this.optionSubject.asObservable(); }

  setOption(value: number): void {
    this._option = value;
    this.optionSubject.next( this._option );
  }

}
