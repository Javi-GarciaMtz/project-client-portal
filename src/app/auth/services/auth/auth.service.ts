import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { auth_customs_gen } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  constructor(
    private http: HttpClient,
  ) { }

  ngOnDestroy(): void {
    console.log('se destruyo el servicio de auth');

  }

  login(email: string, pwd: string): Observable<User> {
    const url = `${auth_customs_gen}login-me`;

    const body = {
      email: email,
      password: pwd
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(url, body, { headers: headers });
  }

}
