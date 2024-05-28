import { Injectable } from '@angular/core';
// import jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import { CertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../date-format/date-format.service';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { LoadingOverlayService } from '../loading-overlay/loading-overlay.service';

import { Montserrat64_Bold } from "./fontsBase64/montserrat-bold";

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

  private certificate!: CertificatesResponse;

  constructor(
    private dateFormatService: DateFormatService,
    private loadingOverlayService: LoadingOverlayService,
    private http: HttpClient,
  ) { }

  private getImageBase64(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  private setOpacity(imgBase64: string, opacity: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, 0, 0);
        const newBase64 = canvas.toDataURL('image/png');
        resolve(newBase64);
      };
      img.src = imgBase64;
    });
  }

  private async addImg2Doc(doc:jsPDF, imgUrl:string, opacity:number): Promise<void> {
    const imgBase64 = await this.getImageBase64(imgUrl);
    const newBase64 = await this.setOpacity(imgBase64, opacity);

    console.log('base64', newBase64);


    doc.addImage(newBase64, 'PNG', 10, 10, 500, 500);
  }

  addHeaderAndFooter(doc:jsPDF): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const yInit = 50;
    const xInit = 50;

    const maxWidth = 512;
    const maxHeight = 692;

    const yInitAfterHeader = 195;
    const xInitAfterHeader = 50;

    const maxWidthAfterFooter = 562;
    const maxHeightAfterFooter = 670;

    const stringsHeader = [
      { fontSize: 14, text: `INGENIERÍA COMERCIAL Y NORMATIVA, S. A. DE C. V. UNIDAD DE INSPECCIÓN`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `center` },
      { fontSize: 14, text: `UINOM XXX`, lineSpacing: 1.15, spaceAfterLine: 20, font: `helvetica`, bold: `bold`, textAlign: `center` },
      { fontSize: 14, text: `SOLICITUD DE SERVICIO`, lineSpacing: 1.15, spaceAfterLine: 20, font: `helvetica`, bold: `bold`, textAlign: `center` },

      { fontSize: 11, text: `Fecha de solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `right` },
      { fontSize: 11, text: `No. de Solicitud: ${this.certificate.code}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `right` },
      { fontSize: 11, text: `No. de Folio: ${this.certificate.folio}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `right` },
    ];

    const stringFooter = [
      { fontSize: 9, text: `Dirección física`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `center` },
      { fontSize: 9, text: `WhatsApp`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `center` },
      { fontSize: 9, text: `xxx@xxxx`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `center` },

      { fontSize: 9, text: `CLAVE:`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `REVISIÓN:`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
    ];

    let yOffset = yInit;
    stringsHeader.forEach(( s:any ) => {
      doc.setFont(s.font, s.bold);

      doc.setFontSize(s.fontSize);
      let splitText = doc.splitTextToSize(s.text, maxWidth);

      splitText.forEach((line:any) => {
        const textWidth = doc.getTextWidth(line);
        const xCenter = (pageWidth - maxWidth) / 2 + (maxWidth - textWidth) / 2;
        const xRight = (pageWidth - maxWidth) / 2 + maxWidth - textWidth;
        const xLeft = (pageWidth - maxWidth) / 2;

        switch (s.textAlign) {
          case `center`:
            doc.text(line, xCenter, yOffset);
          break;

          case `right`:
            doc.text(line, xRight, yOffset);
          break;

          case `left`:
            doc.text(line, xLeft, yOffset);
          break;

          default:
            doc.text(line, xRight, yOffset);
          break;
        }

        yOffset += s.fontSize * s.lineSpacing;

        if( s.spaceAfterLine !== 0 ) {
          yOffset += s.spaceAfterLine;
        }

      });

    });

    // * Se coloca el footer
    yOffset = 682;

    stringFooter.forEach(( s:any ) => {
      doc.setFont(s.font, s.bold);

      doc.setFontSize(s.fontSize);
      let splitText = doc.splitTextToSize(s.text, maxWidth);

      splitText.forEach((line:any) => {
        const textWidth = doc.getTextWidth(line);
        const xCenter = (pageWidth - maxWidth) / 2 + (maxWidth - textWidth) / 2;
        const xRight = (pageWidth - maxWidth) / 2 + maxWidth - textWidth;
        const xLeft = (pageWidth - maxWidth) / 2;

        switch (s.textAlign) {
          case `center`:
            doc.text(line, xCenter, yOffset);
          break;

          case `right`:
            doc.text(line, xRight, yOffset);
          break;

          case `left`:
            doc.text(line, xLeft, yOffset);
          break;

          default:
            doc.text(line, xRight, yOffset);
          break;
        }

        yOffset += s.fontSize * s.lineSpacing;

        if( s.spaceAfterLine !== 0 ) {
          yOffset += s.spaceAfterLine;
        }

      });

    });

  }

  async generatePDF2(certi: CertificatesResponse): Promise<void> {
    this.certificate = certi;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: 'letter',compress:true });

    // * Agregar la fuente convertida al documento
    doc.addFileToVFS("Montserrat64_Bold.ttf", Montserrat64_Bold);
    doc.addFont("Montserrat64_Bold.ttf", "Montserrat64_Bold", "normal");

    await this.addImg2Doc(doc, `./assets/images/logo-vec-ingcom-final-2.png`, 0.25);

    // doc.setDrawColor(0, 255, 0); // Verde
    // doc.rect(50, 50, 512, 642, 'S'); // 'S' significa 'Stroke' (solo borde)

    // // Establecer el color del borde a azul
    // doc.setDrawColor(0, 0, 255); // Azul
    // doc.rect(50, 195, 512, 475, 'S'); // 'S' significa 'Stroke' (solo borde)

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const yInit = 50;
    const xInit = 50;

    const maxWidth = 512;
    const maxHeight = 692;


    const yInitAfterHeader = 200;
    // const yInitAfterHeader = 195;
    const xInitAfterHeader = 50;

    const maxWidthAfterFooter = 562;
    const maxHeightAfterFooter = 670;

    let fontSize = -1;

    const data = [
      { fontSize: 11, text: `Nombre de la empresa: [[data_3]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Domicilio fiscal: [[data_4]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `RFC: [[data_5]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Tipo de persona: [[data_6]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Tipo de servicio: [[data_7]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Norma requerida: [[data_8]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Modalidad de etiquetado: ${this.certificate.labeling_mode}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Aduana de ingreso de la mercancía: [[data_10]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Número factura: ${this.certificate.invoice_number}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Fecha probable de internación: ${this.dateFormatService.getMomentObj(this.certificate.entry_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Fecha de vigencia de la solicitud: [[data_13]]`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Domicilio donde se realizará la inspección: ${this.certificate.verification_address}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Fecha tentativa para la inspección: ${this.dateFormatService.getMomentObj(this.certificate.scheduled_verification_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Notas aclaratorias: ${this.certificate.clarifications}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Nombre de quien realiza el trámite: ${this.certificate.applicant_name}`, lineSpacing: 1.15, spaceAfterLine: 200, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `[[img]]`, lineSpacing: 1.15, spaceAfterLine: 200, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 9, text: `Consideraciones`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 9, text: `1. La empresa solicita este servicio y se compromete a realizar la cancelación de la totalidad de la solicitud o de alguno de los folios en caso de que no fueran requeridos.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `2. La presente solicitud de servicio tiene una vigencia de 30 días naturales a partir de la fecha de emisión y transcurrido este periodo no deberá ser utilizada por el importador.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `3. La aceptación de la presente implica que el cliente está de acuerdo con lo establecido en el contrato de prestación de servicios.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `4. El cliente se compromete a apegarse a lo establecido en los ordenamientos legales vigentes al momento de la emisión de esta solicitud de servicio de acuerdo con el servicio solicitado (Dictamen o Constancia). Para el caso de dictamen, la fecha programada para la inspección no podrá ser posterior a treinta días naturales contados a partir de la importación de las mercancías (desaduanamiento de las mercancías).`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `5. Los servicios de inspección que se realicen en la Ciudad de México podrán incluir viáticos para alimentación o traslado mismos que deberán ser cubiertos por la empresa.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `6. Para los servicios de inspección que se realicen fuera de la Ciudad de México, se hace de su conocimiento que la empresa deberá cubrir los viáticos requeridos relacionados con trasportación, hospedaje y alimentación mismos que deberán ser cubiertos para la realización de la visita de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `7. La veracidad de la información contenida en las etiquetas, empaques, envases, instructivos, garantías, etc. es responsabilidad exclusiva del importador o responsable del producto.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `8. Toda la información relacionada con esta solicitud de servicio y los productos sujetos a la inspección son propiedad del cliente y serán manejados de manera confidencial, pudiendo proporcionarse a las autoridades competentes cuando así se lo requieran a la unidad de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

    ];

    // const x = (pageWidth - maxWidth) / 2; // Centrando horizontalmente
    // const y = (pageHeight - maxHeight) / 2; // Centrando verticalmente

    this.addHeaderAndFooter(doc);


    // * Se coloca el header
    let yOffset = yInitAfterHeader;
    let sealsPosition: any = [];

    data.forEach(( s:any ) => {
      // doc.setFont(s.font, s.bold);
      doc.setFont("Montserrat64_Bold", "normal");
      fontSize = s.fontSize;
      doc.setFontSize(fontSize);

      let splitText = doc.splitTextToSize(s.text, maxWidth);

      if( s.text  === `[[img]]` ) {
        sealsPosition.push(yOffset);

      } else {
        splitText.forEach((line:any) => {
          const textWidth = doc.getTextWidth(line);
          const xCenter = (pageWidth - maxWidth) / 2 + (maxWidth - textWidth) / 2;
          const xRight = (pageWidth - maxWidth) / 2 + maxWidth - textWidth;
          const xLeft = (pageWidth - maxWidth) / 2;

          if( yOffset + fontSize + s.spaceAfterLine > maxHeightAfterFooter ) {
            doc.addPage();
            this.addHeaderAndFooter(doc);

            // doc.setFont(s.font, s.bold);
            doc.setFont("Montserrat64_Bold", "normal");
            fontSize = s.fontSize;
            doc.setFontSize(fontSize);

            yOffset = yInitAfterHeader;

          }

          switch (s.textAlign) {
            case `center`:
              doc.text(line, xCenter, yOffset);
            break;

            case `right`:
              doc.text(line, xRight, yOffset);
            break;

            case `left`:
              doc.text(line, xLeft, yOffset);
            break;

            default:
              doc.text(line, xRight, yOffset);
            break;
          }

          yOffset += fontSize * s.lineSpacing;

          if( s.spaceAfterLine !== 0 ) {
            yOffset += s.spaceAfterLine;
          }

        });

      }

    });

    doc.save('solicitud.pdf');

  }

  generatePDF(certifcate: CertificatesResponse): void {
    this.loadingOverlayService.addLoading();

    let htmlContent1stPage: string = '';
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: 'letter',compress:true });

    if( certifcate.request_type === 'opinion') {
      // htmlContent1stPage = this.generateOpinionFirstPage(certifcate);

      this.http.get('assets/html/certificates/1stPageOpinion.html', { responseType: 'text' }).subscribe(data => {
        const arrayData = [
          ['[[data_0]]', this.dateFormatService.getMomentObj(certifcate.created_at).format("DD/MM/YYYY")],
          ['[[data_1]]', certifcate.code],
          ['[[data_2]]', certifcate.folio],
          ['[[data_3]]', `...`],
          ['[[data_4]]', `...`],
          ['[[data_5]]', `...`],
          ['[[data_6]]', `...`],
          ['[[data_7]]', `Dictamen`],
          ['[[data_8]]', `...`],
          ['[[data_9]]', certifcate.labeling_mode!],
          ['[[data_10]]', `...`],
          ['[[data_11]]', certifcate.invoice_number!],
          ['[[data_12]]', this.dateFormatService.getMomentObj(certifcate.entry_date!).format("DD/MM/YYYY")],
          ['[[data_13]]', `...`],
          ['[[data_14]]', certifcate.verification_address!],
          ['[[data_15]]', this.dateFormatService.getMomentObj(certifcate.scheduled_verification_date!).format("DD/MM/YYYY")],
          ['[[data_16]]', certifcate.clarifications],
          ['[[data_17]]', certifcate.applicant_name],
        ];

        let htmlContent = data;
        arrayData.forEach((a) => {
          htmlContent = htmlContent.replaceAll(a[0], a[1]);
        });


        doc.html( htmlContent , {
          callback: function (doc) {
            // doc.addPage();

            // var pageCount = doc.getNumberOfPages();
            // doc.deletePage(pageCount);

            const numberPages = doc.getNumberOfPages();

            for (let i = 1; i <= numberPages; i++) {
              doc.setPage(i);
              doc.text(`${i}`, 600,780);
            }

            const dateM = moment();
            const promiseSavePDF = doc.save(`${dateM.format("YYYYMMDDHHmmss")}_testing.pdf`, { returnPromise: true });
            return promiseSavePDF;

          },

        }).then(() => {
          this.loadingOverlayService.removeLoading();
        });

      });

    } else {
      // htmlContent1stPage = this.generateCertificateFirstPage(certifcate);
    }



  }

}
