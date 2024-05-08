import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  getMomentObj(ogDate: string): moment.Moment {
    return moment(ogDate);
  }

}
