import { Component } from '@angular/core';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrl: './privacy-notice.component.scss'
})
export class PrivacyNoticeComponent {

  public date: Moment = moment();

}
