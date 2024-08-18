import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { Observable } from 'rxjs';
import { url_customs_gen } from '../../../environments/environments';
import { ResponseUpdateStatus } from '../../interfaces/responseUpdateStatus.interface';

@Injectable({
  providedIn: 'root'
})
export class UpdateCertificateService {

  constructor(
    private http: HttpClient,
  ) { }


  updateStatus(certificate: CertificatesResponse, status: number): Observable<ResponseUpdateStatus> {
    const url = `${url_customs_gen}certificate/update-status`;

    const body = {
      certificate_id: certificate.id,
      status_certificate: status
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.patch<ResponseUpdateStatus>(url, body, { headers: headers });

  }

}
