import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  getMomentObj(ogDate: Date): moment.Moment {
    return moment(ogDate);
  }

}
