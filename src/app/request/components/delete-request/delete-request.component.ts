import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CertificatesResponse } from '../../../shared/interfaces/responseCertificates.interfaces';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { UpdateCertificateService } from '../../../shared/services/update-certificate/update-certificate.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Subscription } from 'rxjs';
import { ResponseDeleteCertificate } from '../../../shared/interfaces/responseDeleteCertificate.interface';

@Component({
  selector: 'app-delete-request',
  templateUrl: './delete-request.component.html',
  styleUrl: './delete-request.component.scss'
})
export class DeleteRequestComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {certificate: CertificatesResponse},
    private loadingOverlayService: LoadingOverlayService,
    private updateCertificateService: UpdateCertificateService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.arrSubs.forEach( (s:Subscription) => {s.unsubscribe()});
  }

  onNoClick(): void {
    this.dialogRef.close(-1);
  }

  deleteCertificate(): void {
    this.loadingOverlayService.addLoading();

    this.arrSubs.push(
      this.updateCertificateService.deleteCertificate(this.data.certificate).subscribe({
        next: (r: ResponseDeleteCertificate) => {
          this.loadingOverlayService.removeLoading();
          if( r.code === 201 ) {
            this.toastService.showSnackbar(true, `Solicitud eliminada correctamente.`, 7000);
            this.dialogRef.close(this.data.certificate);
          }

        },
        error: (e: any) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(false, `Error desconocido al eliminar la solicitud. (CODE: UNKNOWN_001)`, 7000);
          this.dialogRef.close(-1);

        }
      })
    );

  }


}
