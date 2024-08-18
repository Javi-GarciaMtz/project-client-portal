import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingOverlayService } from '../../services/loading-overlay/loading-overlay.service';
import { UpdateCertificateService } from '../../services/update-certificate/update-certificate.service';
import { Subscription } from 'rxjs';
import { ResponseUpdateStatus } from '../../interfaces/responseUpdateStatus.interface';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-modify-status-certificate',
  templateUrl: './modify-status-certificate.component.html',
  styleUrl: './modify-status-certificate.component.scss'
})
export class ModifyStatusCertificateComponent implements OnInit, OnDestroy {

  private arrSubs: Subscription[] = [];

  public status = [
    { value: 3, title: 'Aceptada' },
    { value: 2, title: 'Cancelada' },
  ];
  public formChangeStatus: FormGroup = new FormGroup({
    status: new FormControl(null, [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<ModifyStatusCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {certificate: CertificatesResponse},
    private loadingOverlayService: LoadingOverlayService,
    private updateCertificateService: UpdateCertificateService,
    private toastService: ToastService,
  ) {

  }

  ngOnInit(): void {
    console.log('modal certificate', this.data);

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach( (s:Subscription) => {s.unsubscribe()});
  }

  onNoClick(): void {
    this.dialogRef.close(-1);
  }

  updateStatus(): void {
    this.loadingOverlayService.addLoading();
    const idStatusToUpdate = this.formChangeStatus.value.status;
    this.arrSubs.push(
      this.updateCertificateService.updateStatus(this.data.certificate, idStatusToUpdate).subscribe({
        next: (r: ResponseUpdateStatus) => {
          this.loadingOverlayService.removeLoading();
          if( r.code === 201 ) {
            this.toastService.showSnackbar(true, `Estatus de la solicitud actualizado correctamente.`, 7000);
            this.dialogRef.close(idStatusToUpdate);
          }
        },
        error: (e: any) => {
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(false, `Error desconocido al actualizar el estatus de la solicitud. (CODE: UNKNOWN_001)`, 7000);
          this.dialogRef.close(-1);

        }
      })
    );

  }

}
