import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-show-errors-in-form',
  templateUrl: './show-errors-in-form.component.html',
  styleUrls: ['./show-errors-in-form.component.scss']
})
export class ShowErrorsInFormComponent {

  @Input() public genericForm!: FormGroup;
  @Input() public genericFormControlName: string = '';

  @Input() public textRequired: string = '';
  @Input() public textMinLength: string = '';
  @Input() public textMaxLength: string = '';
  @Input() public textPattern: string = '';
  @Input() public textEmail: string = '';

  constructor() {}

  checkFormTouched(): boolean {
    return this.genericForm.invalid && ( this.genericForm.get(this.genericFormControlName)!.dirty || this.genericForm.get(this.genericFormControlName)!.touched );
  }

  getInputErrors(): any {
    // console.log('ERRORS', this.genericForm.get(this.genericFormControlName)!.errors);
    return this.genericForm.get(this.genericFormControlName)!.errors;
  }

}

