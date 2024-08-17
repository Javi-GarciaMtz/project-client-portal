import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestUserService } from '../../services/request-user/request-user.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { CertificatesResponse, ResponseCertificates } from '../../../shared/interfaces/responseCertificates.interfaces';
import { User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { DataToSearchCertificates } from '../../../shared/interfaces/dataToSearchCertificates.interface';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-my-requests-container',
  templateUrl: './my-requests-container.component.html',
  styleUrl: './my-requests-container.component.scss'
})
export class MyRequestsContainerComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public user: User;
  public certificates: CertificatesResponse[] = [];
  public certificatesCopy: CertificatesResponse[] = [];

  constructor(
    private requestUserService: RequestUserService,
    private storageService: StorageService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
  ) {
    this.user = this.storageService.retrieveAndDecryptUser();
  }

  ngOnInit(): void {
    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.requestUserService.getAllCertificates( this.storageService.retrieveAndDecryptUser().user.id ).subscribe({
        next: (r: ResponseCertificates) => {
          this.certificates = r.data;
          this.certificatesCopy = [ ...r.data ];
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

  /*
  searchArray(arr: CertificatesResponse[], searchTerm: string): any[] {
    return arr.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.applicant_name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term) ||
        item.customs_rule.name.toLowerCase().includes(term)
      );
    });
  }
  */

  searchArray(arr: any[], searchTerm: string, startDate?: Date, endDate?: Date): any[] {
    return arr.filter(item => {

      let term = searchTerm.toLowerCase();
      if(term === '') term = '~';

      const isMatch = (
        item.applicant_name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term) ||
        item.customs_rule.name.toLowerCase().includes(term)
      );

      if (!startDate && !endDate) {
        // * Si no se proporciona un rango de fechas, solo se filtra por el término de búsqueda
        return isMatch;
      }

      // * Usando moment.js para manejar fechas
      const createdAt = moment(item.created_at);
      const start = moment(startDate);
      const end = moment(endDate);
      end.hour(23).minute(59).second(59).millisecond(0);

      // * Verificar si la fecha de creación está dentro del rango (si se proporciona un rango)
      const isInDateRange = createdAt.isSameOrAfter(start) && createdAt.isSameOrBefore(end);

      return isMatch || isInDateRange;
    });
  }

  handlerSearchEvent(data1: [DataToSearchCertificates, boolean]): void {
    const [data, flagClean] = data1;

    // * Si llega la bandera de limpiar resultados, reiniciamos
    if( flagClean ) {
      this.certificates = [...this.certificatesCopy];
      return;
    }

    // * Si no, hacemos la busqueda con los parametros dados
    if( data.searchText !== '' || (data.searchStartDate !== null && data.searchEndDate !== null) ) {
      this.loadingOverlayService.addLoading();
      setTimeout(() => {
        this.loadingOverlayService.removeLoading();
        if( data.searchStartDate !== null && data.searchEndDate !== null ) {
          this.certificates = [...this.searchArray(this.certificatesCopy, data.searchText, data.searchStartDate, data.searchEndDate)];
        } else {
          this.certificates = [...this.searchArray(this.certificatesCopy, data.searchText)];
        }

        if(this.certificates.length === 0) {
          this.toastService.showSnackbar(false, `No hay resultados que coincidan con la búsqueda.`, 10000);
        }
      }, 700);

    } else {
      this.toastService.showSnackbar(false, `No hay parámetros para realizar la búsqueda.`, 3000);
      return;

    }

  }

}
