import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { User } from '../../../auth/interfaces/user.interface';
import { StorageService } from '../../services/storage/storage.service';
import { Subscription } from 'rxjs';
import { ExportXlsxService } from '../../services/export-xlsx/export-xlsx.service';
import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataToSearchCertificates } from '../../interfaces/dataToSearchCertificates.interface';

@Component({
  selector: 'app-search-bar-requests',
  templateUrl: './search-bar-requests.component.html',
  styleUrl: './search-bar-requests.component.scss'
})
export class SearchBarRequestsComponent implements OnDestroy {

  @Output() eventSearch = new EventEmitter<[DataToSearchCertificates, boolean]>();

  private arrSubs: Subscription[] = [];
  public user: User;
  public flagClean: boolean = false;

  public formSearch: FormGroup = new FormGroup({
    searchText: new FormControl('', []),
    searchStartDate: new FormControl(null, []),
    searchEndDate: new FormControl(null, [])
  });

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

  onSearch(): void {
    const data = this.formSearch.value;
    this.eventSearch.emit([data, false]);
    this.flagClean = true;
  }

  clean(): void {
    const data = this.formSearch.value;
    this.eventSearch.emit([data, true]);
    this.flagClean = false;
    this.formSearch.setValue({
      searchText: '',
      searchStartDate: null,
      searchEndDate: null
    });
  }

  canISearch(): boolean {
    const data:DataToSearchCertificates  = this.formSearch.value;
    if( data.searchText !== '' || ( data.searchStartDate !== null && data.searchEndDate !== null ) ) {
      return true;
    } else {
      return false;
    }
  }

}
