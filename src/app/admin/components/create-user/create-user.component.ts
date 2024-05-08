import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { addressPattern, companyNamePattern, namePattern, phoneNumberPattern, rfcPatternPhysical } from '../../../data/data';
import { AccountService } from '../../services/account/account.service';
import { FormCreateAccount } from '../../interfaces/formCreateAccount.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ResponseCreateAccount } from '../../interfaces/responseCreateAccount.interface';
import { ResponseAllRules, Rule } from '../../interfaces/responseAllRules.interface';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public rules: Rule[] = []
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

      typePerson: new FormControl('physical', [Validators.required]),
      rfc: new FormControl(null, [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(rfcPatternPhysical)]),

      rules: new FormControl(null, [Validators.required]),

      pwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      pwd2: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    });

  }

  ngOnInit(): void {
    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.accountService.getAllRules().subscribe({
        next: (r: ResponseAllRules) => {
          this.rules = r.data;
          this.loadingOverlayService.removeLoading();
        },
        error: (e: any) => {
          this.toastService.showSnackbar(false, 'Error desconocido durante la ejecución. (CODE: 001)', 5000);
        }
      })
    );

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  onSubmit(): void {
    const data: FormCreateAccount = this.formCreateAccount.value;

    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.accountService.createAccount(data).subscribe({
        next: (r: ResponseCreateAccount) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(true, `Usuario creado correctamente`, 4000);
          this.formCreateAccount.reset();
        },
        error: (e: any) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(false, `Error desconocido al crear al usuario, por favor intenta más tarde.`, 5000);
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
