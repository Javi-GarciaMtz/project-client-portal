import { Component } from '@angular/core';
import { RequestService } from '../../services/request/request.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent {

  constructor(
    private _requestService: RequestService
  ) {}


  onSubmit(): void {
    this._requestService.setOption(1);
  }

}
