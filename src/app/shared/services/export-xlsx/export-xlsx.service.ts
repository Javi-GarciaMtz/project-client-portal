import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url_customs_gen } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportXlsxService {

  constructor(
    private http: HttpClient,
  ) { }

  downloadXlsxCertificates(id: number, token: string): Observable<any> {
    const data2Send = {
      user_id: id
      // "date": "2024-05-09"
    };

    // * Ya esta listo para QA
    const url = `${url_customs_gen}reports/certificates`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'blob',
      'Authorization': `Bearer ${token}`,
    });
    // return this._http.post<Blob>(url, data2Send, { headers });

    return this.http.post(url, data2Send, { responseType: 'blob', headers: headers });
  }

}
