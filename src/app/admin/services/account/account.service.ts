import { url_customs_gen } from './../../../environments/environments';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  createAccount(dataForm: FormCreateAccount): Observable<ResponseCreateAccount> {
    const url = `${url_customs_gen}auth/register`;

    const body = {
      company_name: dataForm.company,
      company_tax_address: dataForm.taxAddress,
      user_name: dataForm.name,
      user_middle_name: dataForm.lastName,
      user_rfc: dataForm.rfc,
      user_entity_type: dataForm.typePerson,
      user_password: dataForm.pwd,
      email: dataForm.email
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseCreateAccount>(url, body, { headers: headers });

  }

}
