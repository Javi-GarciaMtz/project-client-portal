import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { Observable } from 'rxjs';
import { url_customs_gen } from '../../../environments/environments';
import { ResponseUpdateStatus } from '../../interfaces/responseUpdateStatus.interface';
import { ResponseDeleteCertificate } from '../../interfaces/responseDeleteCertificate.interface';

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

  /*
  deleteCertificate(certificate: CertificatesResponse): Observable<any> {
    const url = `${url_customs_gen}certificate/update-status`;

    const deleteStatus = 1;
    const body = {
      certificate_id: certificate.id,
      status: deleteStatus
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.delete<any>(url, body, { headers: headers });

  }
  */

  deleteCertificate(certificate: CertificatesResponse): Observable<ResponseDeleteCertificate> {
    const url = `${url_customs_gen}certificate/delete-certificate`;

    const deleteStatus = 2;
    const body = {
      certificate_id: certificate.id,
      status: deleteStatus
    };

    const options = {
      body: body
    };

    return this.http.request<ResponseDeleteCertificate>('DELETE', url, options);
  }

}
