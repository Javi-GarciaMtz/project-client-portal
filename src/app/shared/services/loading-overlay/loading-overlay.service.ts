import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {

  private _loading: boolean = false;
  private loadingSubject = new Subject<boolean>();

  constructor() { }

  get loading(): boolean { return this._loading; }

  get getLoading(): Observable<boolean> { return this.loadingSubject.asObservable(); }

  setLoading(value: boolean): void {
    this._loading = value;
    this.loadingSubject.next( this._loading );
  }

}
