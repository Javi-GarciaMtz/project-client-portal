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
    this.generatePDF();
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

  generatePDF(): void {
    // // Crear un nuevo documento PDF
    // const doc = new jsPDF('p', 'pt', 'letter');

    // const canvas = document.getElementById('docpdf') as HTMLCanvasElement;


    // const imageData = canvas.toDataURL('image/png');

    // // Insertar la imagen en el PDF
    // doc.addImage(imageData, 'PNG', 10, 10, 100, 100); // coordenadas x, y, ancho, alto

    // // Guardar el PDF
    // doc.save('documento.pdf');




    // const doc = new jsPDF();

    // doc.text('Hello world!', 10, 10);
    // doc.save('hello-world.pdf');



    // const doc = new jsPDF('p', 'pt', 'letter', true);
    var doc = new jsPDF({ orientation: "portrait", unit: "pt", format: 'letter',compress:true });

    let HTMLCode = ``;
    this.http.get('assets/html/certificates/info-page.html', { responseType: 'text' }).subscribe(data => {
      HTMLCode = `${data}`;

      this.loadingOverlayService.addLoading();

      doc.html( HTMLCode , {
        callback: function (doc) {
          // doc.addPage();

          var pageCount = doc.getNumberOfPages();
          doc.deletePage(pageCount);
          const dateM = moment();
          const promiseSavePDF = doc.save(`${dateM.format("YYYYMMDDHHmmss")}_testing.pdf`, { returnPromise: true });
          return promiseSavePDF;

        },

      }).then(() => {
        this.loadingOverlayService.removeLoading();
      });

    });


    // doc.save();
    // doc.html(document.getElementById("docpdf")!, {
    //   callback: function (pdf) {
    //     pdf.addPage("a4", "l");
    //     pdf.html(document.getElementById("docpdf")!, {
    //       callback: function (pdf2) {
    //         pdf2.addPage("a4", "l");
    //         pdf2.html(document.getElementById("docpdf")!, {
    //           callback: function (pdf3) {
    //             pdf3.save("multipage.pdf")
    //           },
    //           x: 0,
    //           y: 2 * 11,
    //         });
    //       },
    //       x: 0,
    //       y: 22,
    //     });
    //   },
    //   x: 0,
    //   y: 0,
    // });

    // doc.save('hello-world.pdf');


    // Extraemos el
    // const DATA = document.getElementById('htmlData');
    // const doc = new jsPDF('p', 'pt', 'a4');
    // const options = {
    //   background: 'white',
    //   scale: 3
    // };
    // html2canvas(DATA!, options).then((canvas) => {

    //   const img = canvas.toDataURL('image/PNG');

    //   // Add image Canvas to PDF
    //   const bufferX = 15;
    //   const bufferY = 15;
    //   const imgProps = (doc as any).getImageProperties(img);
    //   const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    //   return doc;
    // }).then((docResult) => {
    //   docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    // });



    // const docPdf = document.getElementById('docpdf');
    // const doc = new jsPDF('p', 'pt', 'letter');

    // const options = {
    //   background: 'white',
    //   scale: 1
    // };

    // html2canvas(docPdf!, options).then((canvas) => {

    //   const img = canvas.toDataURL('image/PNG');

    //   // Add image Canvas to PDF
    //   const bufferX = 15;
    //   const bufferY = 15;
    //   const imgProps = (doc as any).getImageProperties(img);
    //   const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    //   doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, `SLOW`); // Calidad de imagen del 80%
    //   return doc;
    // }).then((docResult) => {
    //   docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    // });


  }

}


