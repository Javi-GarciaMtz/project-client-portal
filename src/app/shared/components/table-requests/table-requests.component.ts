import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../../services/date-format/date-format.service';
import { GeneratePdfService } from '../../services/generate-pdf/generate-pdf.service';

import { LoadingOverlayService } from '../../services/loading-overlay/loading-overlay.service';
import moment from 'moment';
import { ModifyStatusCertificateComponent } from '../modify-status-certificate/modify-status-certificate.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteRequestComponent } from '../../../request/components/delete-request/delete-request.component';
import { TabsModifyComponent } from '../../../request/components/tabs-modify/tabs-modify.component';
import { RequestService } from '../../../request/services/request/request.service';

@Component({
  selector: 'app-table-requests',
  templateUrl: './table-requests.component.html',
  styleUrl: './table-requests.component.scss'
})
export class TableRequestsComponent implements AfterViewInit, OnChanges, OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() public certificates: CertificatesResponse[] = [];
  @Input() public role: string = '';

  public displayedColumnsFinal: string[] = [
    'user',
    'key',
    'date',
    'service',
    'rule',
    'products',
    'verify',
    'state',
    'pdf',
    'edit',
    'delete'
  ];
  public dataSourceFinal = new MatTableDataSource<CertificatesResponse>(this.certificates);

  constructor(
    private dateFormatService: DateFormatService,
    private generatePdfService: GeneratePdfService,
    private loadingOverlayService: LoadingOverlayService,
    private dialog: MatDialog,
    private requestService: RequestService,
  ) {}

  ngOnInit(): void {
    // * Si el rol es admin habilitamos el modificar estatus
    if( this.role === 'admin' ) {
      const index = this.displayedColumnsFinal.indexOf('pdf');
      if (index !== -1) { this.displayedColumnsFinal.splice(index, 0, 'modifyStatus'); }
    }
  }

  ngAfterViewInit() {
    this.dataSourceFinal.paginator = this.paginator;
  }

  updateDataToShowMatTable(): void {
    this.dataSourceFinal.data = this.certificates.filter(certificate => certificate.status !== 'inactive');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes['certificates'] ) {
      const current = changes['certificates'].currentValue;
      if( current.length > 0 ) {
        this.certificates = current;
      } else {
        this.certificates = [];
      }

      this.updateDataToShowMatTable();

    }

  }

  getDateString(dateS: string): string {
    return this.dateFormatService.getMomentObj(dateS).format("DD/MM/YYYY HH:mm");
  }

  generatePDF2(certifcate: CertificatesResponse): void {
    this.generatePdfService.generatePDF2(certifcate);
  }

  modifyCertificate(certifcate: CertificatesResponse): void {
    const dialogRef = this.dialog.open(TabsModifyComponent, {
      // width: '400px',
      // height: '90%',
      data: { certificate: certifcate },
      autoFocus: false, // * Deshabilita el autofocus
      // disableClose: true, // * Deshabilita el cierre al hacer clic fuera del modal o presionar ESC
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // if(result !== undefined && result !== -1) {
        // console.log('result', result);
        this.requestService.setRestartTable(true);

      // }

    });

  }

  // * Elimina una solicitud de forma local (en el mat table)
  deleteCertificateStatusLocal(certificates: CertificatesResponse[], id: number): CertificatesResponse[] {
    return certificates.map(certificate =>
      certificate.id === id
        ? { ...certificate, status: 'inactive' }
        : certificate
    );
  };

  // * Metodo que se encarga de la eliminacion de una solicitud
  deleteCertificate(certifcate: CertificatesResponse): void {
    const dialogRef = this.dialog.open(DeleteRequestComponent, {
      // width: '400px',
      data: { certificate: certifcate },
      autoFocus: false, // * Deshabilita el autofocus
      disableClose: true, // * Deshabilita el cierre al hacer clic fuera del modal o presionar ESC
    });

    // * Dependiendo de la respuesta del modal, es si se hace o no una eliminacion de la solicitud
    dialogRef.afterClosed().subscribe((result: number) => {
      if( result < 0 ) return;
      // 'cancelled' → 2 , 'accepted' → 3

      this.certificates = this.deleteCertificateStatusLocal(this.certificates, certifcate.id);
      this.updateDataToShowMatTable();

    });

  }

  // * Actualiza el status de la solicitud de forma local (en el mat table)
  updateCertificateStatusLocal(certificates: CertificatesResponse[], id: number, newStatus: string): CertificatesResponse[] {
    return certificates.map(certificate =>
      certificate.id === id
        ? { ...certificate, status_certificate: newStatus }
        : certificate
    );
  };

  // * Abre el modal para la modificacion de status de la solicitud
  modifyStatus(certifcate: CertificatesResponse): void {
    const dialogRef = this.dialog.open(ModifyStatusCertificateComponent, {
      // width: '400px',
      data: { certificate: certifcate },
      autoFocus: false, // * Deshabilita el autofocus
      disableClose: true, // * Deshabilita el cierre al hacer clic fuera del modal o presionar ESC
    });

    // * Dependiendo de la respuesta del modal, es si se hace o no una actualizacion al status de la solicitud
    dialogRef.afterClosed().subscribe((result: number) => {
      if( result < 0 ) return;
      // 'cancelled' → 2 , 'accepted' → 3
      const statusString = ( result === 2 ) ? `cancelled` : `accepted`;
      this.certificates = this.updateCertificateStatusLocal(this.certificates, certifcate.id, statusString);
      this.updateDataToShowMatTable();

    });
  }

  // * Regresa en string el status de la solicitud
  getStatusCertificate(status: string): string {
    // 'review', 'cancelled', 'accepted
    let alertClass = '';
    let alertMessage = '';

    switch(status) {
      case 'review':
        alertClass = 'alert-secondary';
        alertMessage = 'Por validar';
        break;
      case 'cancelled':
        alertClass = 'alert-danger';
        alertMessage = 'Cancelada';
        break;
      case 'accepted':
        alertClass = 'alert-success';
        alertMessage = 'Validada';
        break;
      default:
        alertClass = 'alert-warning';
        alertMessage = 'Estado desconocido';
    }

    return `<div class="alert ${alertClass} p-1 text-center" role="alert" style="white-space: nowrap;"> ${alertMessage} </div>`;

  }

  // * Nos regresa el tiempo de verificacion de la solicitud
  getVerificationDate(date: string): string {
    const dateMoment = this.dateFormatService.getMomentObj(date);
    const today = moment();
    const datePlus30Days = dateMoment.add(30, 'days');
    const diff = datePlus30Days.diff(today);

    const diffDays = moment.duration(diff).asDays();

    const intDays = Math.floor(diffDays);
    const intDaysUp = Math.ceil(diffDays);
    const intDaysRound = Math.round(diffDays);

    /*
      ? Si necesitas saber cuántos días completos han pasado, usa Math.floor().
      ? Si quieres asegurarte de que cualquier fracción de día se cuente como un día completo, usa Math.ceil().
      ? Si prefieres la media estadística, usa Math.round().
    */

    const finalDiffDays = intDaysUp;
    return ( finalDiffDays <= 0 ) ? `Tiempo de verificación excedido` : ( finalDiffDays === 1 ) ? `Falta ${finalDiffDays} día` : `Faltan ${finalDiffDays} días`;
  }

}
