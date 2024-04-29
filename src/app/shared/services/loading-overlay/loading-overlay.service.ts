import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {

  // private _loadingArr: boolean[] = [];
  // private loadingSubject = new Subject<boolean[]>();

  // constructor() { }

  // get loading(): boolean[] { return this._loadingArr; }

  // get getLoading(): Observable<boolean[]> { return this.loadingSubject.asObservable(); }

  // addLoading(): void {
  //   this._loadingArr.push(true);
  //   this.loadingSubject.next( this._loadingArr );
  // }

  // removeLoading(): void {
  //   this._loadingArr.pop();
  //   this.loadingSubject.next( this._loadingArr );
  // }

  private apiCount = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() { }

  addLoading() {
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(true);
    }
    this.apiCount++;
  }

  removeLoading() {
    this.apiCount--;
    if (this.apiCount === 0) {
      this.isLoadingSubject.next(false);
    }
  }

}
