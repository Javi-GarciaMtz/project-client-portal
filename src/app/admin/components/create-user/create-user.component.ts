import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { addressPattern, companyNamePattern, namePattern, phoneNumberPattern, rfcPattern } from '../../../data/data';
import { AccountService } from '../../services/account/account.service';
import { FormCreateAccount } from '../../interfaces/formCreateAccount.interface';
import { ResponseCreateCompany } from '../../interfaces/responseCreateCompany.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ResponseCreateAccount } from '../../interfaces/responseCreateAccount.interface';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public formCreateAccount: FormGroup;
  public confirmPwd: boolean = true;

  constructor(
    private loadingOverlayService: LoadingOverlayService,
    private accountService: AccountService,
    private toastService: ToastService,
  ) {
    this.formCreateAccount = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(namePattern)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(namePattern)]),

      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(30)]),
      company: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(companyNamePattern)]),

      taxAddress: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(addressPattern)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern(phoneNumberPattern)]),

      rfc: new FormControl(null, [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(rfcPattern)]),
      pwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      pwd2: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    });

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  onSubmit(): void {
    const data: FormCreateAccount = this.formCreateAccount.value;

    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.accountService.createCompany(data).subscribe({
        next: (r: ResponseCreateCompany) => {
          // console.log('compañia creada', r);
          this.toastService.showSnackbar(true, `Compañía creada correctamente.`, 3000);

          this.arrSubs.push(
            this.accountService.createAccount(data, r).subscribe({
              next: (re: ResponseCreateAccount) => {
                // console.log('cuenta creada', re);
                this.formCreateAccount.reset();

                this.loadingOverlayService.removeLoading();
                this.toastService.showSnackbar(true, `Usuario creado correctamente.`, 3000);

              },
              error: (e: any) => {
                this.loadingOverlayService.removeLoading();
                this.toastService.showSnackbar(false, `Error desconocido durante la ejecución, por favor intenta más tarde. (CODE: 01)`, 5000);
              }
            })
          );
        },
        error: (e: any) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(false, `Error desconocido durante la ejecución, por favor intenta más tarde. (CODE: 02)`, 5000);
        }
      })
    );

  }

  toUpperCaseRFC(): void {
    const text = this.formCreateAccount.get('rfc')!.value;
    this.formCreateAccount.patchValue({
      rfc: text.toUpperCase()
    });
  }

  checkConfirmPwd(): void {
    const pwd1 = this.formCreateAccount.get('pwd')!.value;
    const pwd2 = this.formCreateAccount.get('pwd2')!.value;

    this.confirmPwd = pwd1 === pwd2;
  }

}
