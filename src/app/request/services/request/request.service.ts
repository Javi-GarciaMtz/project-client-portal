import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../../../shared/interfaces/company.interface';
import { HttpClient } from '@angular/common/http';
import { url_customs_gen } from '../../../environments/environments';
import { ResponseAllCompanies } from '../../interfaces/responseAllCompanies.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private _option: number = 0;
  private optionSubject = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) { }

  get option(): number { return this._option; }
  get getOption(): Observable<number> { return this.optionSubject.asObservable(); }

  setOption(value: number): void {
    this._option = value;
    this.optionSubject.next( this._option );
  }

  getAllCompanies(): Observable<ResponseAllCompanies> {
    const url = `${url_customs_gen}companies`;
    return this.http.get<ResponseAllCompanies>(url);
  }

}
