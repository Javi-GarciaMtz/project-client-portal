import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;

  constructor(
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(30)]),
      pwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
    });
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    const email = this.formLogin.get('email')?.value;
    const pwd = this.formLogin.get('pwd')?.value;

    this.loadingOverlayService.setLoading(true);
    if( email && pwd ) {

      if( email === 'admin@correo.com' && pwd === '123Probando' ) {
        setTimeout(() => {
          localStorage.setItem('session', JSON.stringify({type: 'admin'}));
          this.loadingOverlayService.setLoading(false);
          this.router.navigate(['/']);
        }, 2000);

      } else if( email === 'user@correo.com' && pwd === '123Probando' ) {
        setTimeout(() => {
          localStorage.setItem('session', JSON.stringify({type: 'user'}));
          this.loadingOverlayService.setLoading(false);
          this.router.navigate(['/']);
        }, 2000);

      } else {
        setTimeout(() => {
          this.loadingOverlayService.setLoading(false);
        }, 2000);
      }



    }

  }

}
