import { Component, OnDestroy } from '@angular/core';
import { User } from '../../../auth/interfaces/user.interface';
import { StorageService } from '../../services/storage/storage.service';
import { Subscription } from 'rxjs';
import { ExportXlsxService } from '../../services/export-xlsx/export-xlsx.service';
import moment from 'moment';

@Component({
  selector: 'app-search-bar-requests',
  templateUrl: './search-bar-requests.component.html',
  styleUrl: './search-bar-requests.component.scss'
})
export class SearchBarRequestsComponent implements OnDestroy {

  private arrSubs: Subscription[] = [];
  public user: User;

  constructor(
    private storageService: StorageService,
    private exportXlsxService: ExportXlsxService,
  ) {
    this.user = this.storageService.retrieveAndDecryptUser();

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => { s.unsubscribe() });
  }

  exportXLSXUser(): void {
    // this._modalService.openLoadingModal();
    this.arrSubs.push(
      this.exportXlsxService.downloadXlsxCertificates(this.user.user.id, this.user.token).subscribe({
        next: (response: any) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          const now = moment();
          a.download = `certificates_export_${now.format("YYYYMMDD_HHmmss")}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          // this._modalService.closeModal();
          // this._modalService.showToastSuccess('', 'El archivo está listo para su descarga.', 1500);
        },
        error: (err: any) => {
          // this._modalService.closeModal();
          // this._modalService.showToastErrorMsgWithObjError(err, '002');
        }
      })
    );
  }

}
