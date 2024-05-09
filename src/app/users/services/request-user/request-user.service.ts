import { Injectable } from '@angular/core';
import { ResponseCertificates } from '../../../shared/interfaces/responseCertificates.interfaces';
import { url_customs_gen } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestUserService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllCertificates(userId: number): Observable<ResponseCertificates> {
    const url = `${url_customs_gen}certificate/by-user`;
    const body = {
      user_id: userId
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.post<ResponseCertificates>(url, body, httpOptions);

  }

}
