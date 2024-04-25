import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { StorageService } from '../../../shared/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public formLogin: FormGroup;

  constructor(
    private router: Router,
    private loadingOverlayService: LoadingOverlayService,
    private authServicer: AuthService,
    private toasService: ToastService,
    private storageService: StorageService,
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(30)]),
      pwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(30)])
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  onSubmit(): void {
    const formValue = this.formLogin.value;
    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.authServicer.login(formValue.email, formValue.pwd).subscribe({
        next: (u: User) => {
          this.loadingOverlayService.removeLoading();
          this.storageService.encryptAndStoreUser(u);
          this.router.navigate(['/']);

        },
        error: (e: any) => {
          // console.log(`error`, e.error);
          this.loadingOverlayService.removeLoading();
          this.toasService.showSnackbar(false, `${ (e.error.message) ? e.error.message : 'Unknown error, try later' }`, 3000);

        }
      })
    );

  }

}
