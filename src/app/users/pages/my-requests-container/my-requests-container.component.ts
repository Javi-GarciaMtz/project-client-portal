import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestUserService } from '../../services/request-user/request-user.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { CertificatesResponse, ResponseCertificates } from '../../../shared/interfaces/responseCertificates.interfaces';
import { User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-my-requests-container',
  templateUrl: './my-requests-container.component.html',
  styleUrl: './my-requests-container.component.scss'
})
export class MyRequestsContainerComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];
  public user: User;
  public certificates: CertificatesResponse[] = [];

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

}
