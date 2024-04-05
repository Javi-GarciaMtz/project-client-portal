import { Component, OnDestroy } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-request-container',
  templateUrl: './request-container.component.html',
  styleUrl: './request-container.component.scss'
})
export class RequestContainerComponent implements OnDestroy {

  public option: number = 0;
  private _arraySubscriptions: Subscription[] = [];

  constructor(
    private _requestService: RequestService,
  ) {
    this._requestService.setOption(this.option);

    this._arraySubscriptions.push(
      this._requestService.getOption.subscribe({
        next: (response: number) => {
          this.option = response;
        }
      })
    );

  }

  ngOnDestroy(): void {
    this._arraySubscriptions.forEach( (e: Subscription) => { e.unsubscribe(); });
  }

}
