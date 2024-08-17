import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../../services/date-format/date-format.service';
import { GeneratePdfService } from '../../services/generate-pdf/generate-pdf.service';

// import { jsPDF } from 'jspdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LoadingOverlayService } from '../../services/loading-overlay/loading-overlay.service';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

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
  ];
  public dataSourceFinal = new MatTableDataSource<CertificatesResponse>(this.certificates);

  constructor(
    private dateFormatService: DateFormatService,
    private generatePdfService: GeneratePdfService,
    private loadingOverlayService: LoadingOverlayService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
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

  ngOnChanges(changes: SimpleChanges): void {
    if( changes['certificates'] ) {
      const current = changes['certificates'].currentValue;
      if( current.length > 0 ) {
        this.certificates = current;
        this.dataSourceFinal.data = this.certificates;

      }

    }

  }

  getDateString(dateS: string): string {
    return this.dateFormatService.getMomentObj(dateS).format("DD/MM/YYYY HH:mm");
  }

  generatePDF2(certifcate: CertificatesResponse): void {
    this.generatePdfService.generatePDF2(certifcate);
  }

  modifyCertificate(certifcate: CertificatesResponse): void {}

  modifyStatus(certifcate: CertificatesResponse): void {}

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
        alertMessage = 'Rechazada';
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

    return `Faltan ${intDaysUp} días`;
  }

}


