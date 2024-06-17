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

  public exampleData: string[] = [`hola 1`, `hola 2`, `hola 3`, `hola 4`, `hola 5`];

  constructor(
    private dateFormatService: DateFormatService,
    private generatePdfService: GeneratePdfService,
    private loadingOverlayService: LoadingOverlayService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    // this.generatePDF();
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

}


