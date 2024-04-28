import { Component } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent {

  private arrSubs: Subscription[] = [];
  public formCreateRequest: FormGroup;
  public titleRequest: string = 'Constancia';
  public typeForm: number = 1;

  constructor(
    private requestService: RequestService
  ) {
    this.formCreateRequest = new FormGroup({
      type: new FormControl(1, [Validators.required]),
    });

  }

  onSubmit(): void {
    this.requestService.setOption(1);
  }

  changeTypeForm(): void {
    const type = this.formCreateRequest.get('type')!.value;
    this.typeForm = type;
    if(type === 1) {
      this.titleRequest = 'Constancia';
    } else if(type === 2){
      this.titleRequest = 'Dictamen';
    }

  }

}
