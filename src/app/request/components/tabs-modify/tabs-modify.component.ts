import { Component, Inject } from '@angular/core';
import { CertificatesResponse } from '../../../shared/interfaces/responseCertificates.interfaces';
import { ModifyStatusCertificateComponent } from '../../../shared/components/modify-status-certificate/modify-status-certificate.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tabs-modify',
  templateUrl: './tabs-modify.component.html',
  styleUrl: './tabs-modify.component.scss'
})
export class TabsModifyComponent {

  constructor(
    public dialogRef: MatDialogRef<ModifyStatusCertificateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {certificate: CertificatesResponse},
  ) {}

}
