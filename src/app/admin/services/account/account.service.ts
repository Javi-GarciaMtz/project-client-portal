import { url_customs_gen } from './../../../environments/environments';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormCreateAccount } from '../../interfaces/formCreateAccount.interface';
import { ResponseCreateAccount } from '../../interfaces/responseCreateAccount.interface';
import { ResponseAllRules } from '../../interfaces/responseAllRules.interface';
import { StorageService } from '../../../shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  getAllRules(): Observable<ResponseAllRules> {
    const url = `${url_customs_gen}customs-rules`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.get<ResponseAllRules>(url, httpOptions);
  }

  createAccount(dataForm: FormCreateAccount): Observable<ResponseCreateAccount> {
    const url = `${url_customs_gen}auth/register`;
    const customRules: any = [];
    dataForm.rules.forEach((r:number) => customRules.push({id:r}));

    const body = {
      company_name: dataForm.company,
      company_tax_address: dataForm.taxAddress,
      user_name: dataForm.name,
      user_middle_name: dataForm.lastName,
      user_rfc: dataForm.rfc,
      user_entity_type: dataForm.typePerson,
      user_password: dataForm.pwd,
      email: dataForm.email,
      customs_rules: customRules
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseCreateAccount>(url, body, { headers: headers });

  }

}
