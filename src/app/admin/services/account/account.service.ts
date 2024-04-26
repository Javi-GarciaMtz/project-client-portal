import { url_customs_gen } from './../../../environments/environments';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseCreateCompany } from '../../interfaces/responseCreateCompany.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormCreateAccount } from '../../interfaces/formCreateAccount.interface';
import { ResponseCreateAccount } from '../../interfaces/responseCreateAccount.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
  ) { }

  createCompany(data: FormCreateAccount): Observable<ResponseCreateCompany> {
    const url = `${url_customs_gen}companies`;

    const body = {
      name: data.company,
      tax_address: data.taxAddress,
      verification_address: data.taxAddress
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseCreateCompany>(url, body, { headers: headers });

  }

  createAccount(dataForm: FormCreateAccount, dataCompany: ResponseCreateCompany): Observable<ResponseCreateAccount> {
    const url = `${url_customs_gen}auth/register`;

    const body = {
      company_id: dataCompany.data.id,
      name: dataForm.name,
      last_name: '',
      middle_name: dataForm.lastName,
      rfc: dataForm.rfc,
      password: dataForm.pwd,
      email: dataForm.email,
      phone: dataForm.phone
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseCreateAccount>(url, body, { headers: headers });

  }

}
