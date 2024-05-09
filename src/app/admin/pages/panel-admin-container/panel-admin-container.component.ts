import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { AccountService } from '../../services/account/account.service';
import { Subscription } from 'rxjs';
import { CertificatesResponse, ResponseCertificates } from '../../../shared/interfaces/responseCertificates.interfaces';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { User } from '../../../auth/interfaces/user.interface';
import { StorageService } from '../../../shared/services/storage/storage.service';

@Component({
  selector: 'app-panel-admin-container',
  templateUrl: './panel-admin-container.component.html',
  styleUrl: './panel-admin-container.component.scss'
})
export class PanelAdminContainerComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public certificates: CertificatesResponse[] = [];
  public user!: User;

  constructor(
    private loadingOverlayService: LoadingOverlayService,
    private accountService: AccountService,
    private toastService: ToastService,
    private stoareService: StorageService,
  ) {
    this.user = this.stoareService.retrieveAndDecryptUser();
  }

  ngOnInit(): void {
    this.loadingOverlayService.addLoading();
    this.arrSubs.push(
      this.accountService.getAllCertificates().subscribe({
        next: (r:ResponseCertificates) => {
          this.certificates = r.data;
          this.loadingOverlayService.removeLoading();

        },
        error: (e:any) => {
          this.toastService.showSnackbar(false, 'Error desconocido durante la ejecución. (CODE: 001)', 5000);
        }
      })
    );

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

}
