import { Injectable } from '@angular/core';
// import jsPDF from 'jspdf';
// import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import { CertificatesResponse, ProductCertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../date-format/date-format.service';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { LoadingOverlayService } from '../loading-overlay/loading-overlay.service';

import { Montserrat64_Bold } from "./fontsBase64/montserrat-bold";
import { INSPECT_NUMBER, STATUS_ACCEPTED, STATUS_REVIEW, TEXT_CERTIFICATE_CANCELLED, TEXT_CERTIFICATE_REVIEW, TEXT_JUMP_PAGE, TEXT_SELLO } from '../../../data/data';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

  private certificate!: CertificatesResponse;
  private blueIng: string = `#143c81`;
  private orangeIng: string = `#ec7216`;

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

  private async addImg2Doc(doc:jsPDF, imgUrl:string, opacity:number, x:number, y:number, widht: number, height: number): Promise<void> {
    const imgBase64 = await this.getImageBase64(imgUrl);
    const newBase64 = await this.setOpacity(imgBase64, opacity);

    doc.addImage(newBase64, 'PNG', x, y, widht, height);
  }

  async addImgColorsHeaderAndFooter(doc:jsPDF): Promise<void> {

    await this.addImg2Doc(doc, `./assets/images/logo-ingcom-pdf.png`, 1, 50, 20, 208, 60);

    doc.setDrawColor(this.blueIng);
    doc.setLineWidth(1);
    doc.line(50, 85, 306, 85, 'S');

    doc.setDrawColor(this.orangeIng);
    doc.setLineWidth(1);
    doc.line(306, 85, 562, 85, 'S');

    const stringHeader = [
      { fontSize: 12, text: `UNIDAD DE INSPECCIÓN`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 270, y: 45, color: this.blueIng },
      { fontSize: 12, text: `UVNOM${INSPECT_NUMBER}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 310, y: 60, color: this.blueIng },

      { fontSize: 8, text: `Código: FOR-14`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `NA`, x: 440, y: 45, color: `black` },
      { fontSize: 8, text: `Revisión: 0`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `NA`, x: 440, y: 55, color: `black` },
      { fontSize: 8, text: `Inicio de vigencia: ${this.dateFormatService.getMomentObj(this.certificate.created_at).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `NA`, x: 440, y: 65, color: `black` },
    ];

    stringHeader.forEach((s:any) => {
      doc.setTextColor(s.color);
      doc.setFont(s.font, s.bold);
      doc.setFontSize(s.fontSize);
      doc.text(s.text, s.x, s.y);
    });


    const stringFooter = [
      { fontSize: 9, text: `ingcom.com.mx`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 737, color: this.blueIng },
      { fontSize: 9, text: `WhatsApp: 5580130396`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 748, color: this.blueIng },

      { fontSize: 9, text: `tel.: 5525825612`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 470, y: 737, color: this.blueIng },
      { fontSize: 9, text: `uva@ingcom.com.mx`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 470, y: 748, color: this.blueIng },

      { fontSize: 9, text: `dirección: Nicolas San Juan No. 1307 Int. 3, Col. Del Valle Sur, C.P. 03104, Alcaldía Benito Juárez, Ciudad de México`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 759, color: `#143c81` },

    ];

    stringFooter.forEach((s:any) => {
      doc.setTextColor(s.color);
      doc.setFont(s.font, s.bold);
      doc.setFontSize(s.fontSize);
      doc.text(s.text, s.x, s.y);
    });

  }

  async printText2Doc(doc: jsPDF, listText: any[], yInit: number, maxWidth: number, maxHeightAfterFooter: number, yInitAfterHeader: number): Promise<void> {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let yOffset = yInit;

    for (const s of listText) {
      doc.setFont(s.font, s.bold);
      doc.setFontSize(s.fontSize);
      doc.setTextColor(s.color || 'black');

      if( s.text === `${TEXT_JUMP_PAGE}` ) {
        doc.addPage();
        await this.addImgColorsHeaderAndFooter(doc);
        yOffset = yInit;
      } else {

        if( s.text === `${TEXT_SELLO}` ) {

          if(this.certificate.status_certificate === STATUS_ACCEPTED) {

            const spaceAfertSeal = 100;

            if (yOffset + spaceAfertSeal > maxHeightAfterFooter) {
              doc.addPage();
              await this.addImgColorsHeaderAndFooter(doc);
              yOffset = yInit;

            }

            await this.addImg2Doc(doc, `./assets/images/seals/sealTest01.png`, 1, 80, yOffset, 208, 60);
            // src/assets/images/seals

            yOffset += spaceAfertSeal;

          } else {
            let splitText = doc.splitTextToSize( (this.certificate.status_certificate === STATUS_REVIEW) ? TEXT_CERTIFICATE_REVIEW : TEXT_CERTIFICATE_CANCELLED , maxWidth);

            for (const line of splitText) {
              const textWidth = doc.getTextWidth(line);
              const xCenter = (pageWidth - maxWidth) / 2 + (maxWidth - textWidth) / 2;
              const xRight = (pageWidth - maxWidth) / 2 + maxWidth - textWidth;
              const xLeft = (pageWidth - maxWidth) / 2;

              if (yOffset + s.fontSize + s.spaceAfterLine > maxHeightAfterFooter) {
                doc.addPage();
                await this.addImgColorsHeaderAndFooter(doc);
                yOffset = yInit;

                doc.setFont(s.font, s.bold);
                doc.setFontSize(s.fontSize);
                doc.setTextColor(s.color || 'black');

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

              yOffset += s.fontSize * s.lineSpacing;

              if (s.spaceAfterLine !== 0) {
                yOffset += s.spaceAfterLine;
              }
            }

          }

        } else {
          let splitText = doc.splitTextToSize(s.text, maxWidth);

          for (const line of splitText) {
            const textWidth = doc.getTextWidth(line);
            const xCenter = (pageWidth - maxWidth) / 2 + (maxWidth - textWidth) / 2;
            const xRight = (pageWidth - maxWidth) / 2 + maxWidth - textWidth;
            const xLeft = (pageWidth - maxWidth) / 2;

            if (yOffset + s.fontSize + s.spaceAfterLine > maxHeightAfterFooter) {
              doc.addPage();
              await this.addImgColorsHeaderAndFooter(doc);
              yOffset = yInit;

              doc.setFont(s.font, s.bold);
              doc.setFontSize(s.fontSize);
              doc.setTextColor(s.color || 'black');
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

            yOffset += s.fontSize * s.lineSpacing;

            if (s.spaceAfterLine !== 0) {
              yOffset += s.spaceAfterLine;
            }
          }

        }

      }

    }
  }

  async addInfoCertificate(doc:jsPDF): Promise<void> {

    const firstPageContent = [
      { fontSize: 12, text: `SOLICITUD DE SERVICIO`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `bold`, textAlign: `center`, color: this.blueIng },

      { fontSize: 12, text: `(${ (this.certificate.request_type === 'certificate') ? 'Constancia'.toUpperCase() : 'Dictamen'.toUpperCase() })`, lineSpacing: 1.15, spaceAfterLine: 40, font: `helvetica`, bold: `normal`, textAlign: `center`, color: `black` },

      { fontSize: 11, text: `Fecha de solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `right` },
      { fontSize: 11, text: `No. de Solicitud: ${this.certificate.code}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `right` },
      { fontSize: 11, text: `No. de Folio: ${this.certificate.folio}`, lineSpacing: 1.15, spaceAfterLine: 20, font: `helvetica`, bold: `normal`, textAlign: `right` },

      { fontSize: 11, text: `Nombre de la empresa: [[data_3]]`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Domicilio fiscal: [[data_4]]`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `RFC: [[data_5]]`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Tipo de persona: [[data_6]]`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Tipo de servicio: ${ (this.certificate.request_type === 'certificate') ? 'Constancia' : 'Dictamen' }`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Norma requerida: ${this.certificate.customs_rule.name}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Fase: ${ (this.certificate.customs_rule.phase) ? this.certificate.customs_rule.phase : 'NA' }`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

    ];

    if( this.certificate.request_type === 'opinion' ) {
      const middleCertificateContentConstancia = [
        { fontSize: 11, text: `Modalidad de etiquetado: ${this.certificate.labeling_mode}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Aduana de ingreso de la mercancía: ${this.certificate.customs_office!.name}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

        { fontSize: 11, text: `Número factura: ${this.certificate.invoice_number}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

        { fontSize: 11, text: `Fecha probable de internación: ${this.dateFormatService.getMomentObj(this.certificate.entry_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Fecha de vigencia de la solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).add(30, 'days').format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Fecha tentativa para la inspección: ${this.dateFormatService.getMomentObj(this.certificate.scheduled_verification_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      ];

      firstPageContent.push(...middleCertificateContentConstancia);

    } else {
      const middleCertificateContentDictamen = [
        { fontSize: 11, text: `Fecha de vigencia de la solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).add(30, 'days').format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      ];

      firstPageContent.push(...middleCertificateContentDictamen);
    }

    const finalCertificateContent = [
      { fontSize: 11, text: `Domicilio donde se realizará la inspección: ${this.certificate.verification_address}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Notas aclaratorias: ${this.certificate.clarifications}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Nombre de quien realiza el trámite: ${this.certificate.applicant_name}`, lineSpacing: 1.15, spaceAfterLine: 20, font: `helvetica`, bold: `normal`, textAlign: `left` },


      { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },
    ];

    firstPageContent.push(...finalCertificateContent);

    const considerations = [
      { fontSize: 9, text: `Consideraciones`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 9, text: `1. La empresa solicita este servicio y se compromete a realizar la cancelación de la totalidad de la solicitud o de alguno de los folios en caso de que no fueran requeridos.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `2. La presente solicitud de servicio tiene una vigencia de 30 días naturales a partir de la fecha de emisión y transcurrido este periodo no deberá ser utilizada por el importador.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `3. La aceptación de la presente implica que el cliente está de acuerdo con lo establecido en el contrato de prestación de servicios.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `4. El cliente se compromete a apegarse a lo establecido en los ordenamientos legales vigentes al momento de la emisión de esta solicitud de servicio de acuerdo con el servicio solicitado (Dictamen o Constancia). Para el caso de dictamen, la fecha programada para la inspección no podrá ser posterior a treinta días naturales contados a partir de la importación de las mercancías (desaduanamiento de las mercancías).`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `5. Los servicios de inspección que se realicen en la Ciudad de México podrán incluir viáticos para alimentación o traslado mismos que deberán ser cubiertos por la empresa.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `6. Para los servicios de inspección que se realicen fuera de la Ciudad de México, se hace de su conocimiento que la empresa deberá cubrir los viáticos requeridos relacionados con trasportación, hospedaje y alimentación mismos que deberán ser cubiertos para la realización de la visita de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `7. La veracidad de la información contenida en las etiquetas, empaques, envases, instructivos, garantías, etc. es responsabilidad exclusiva del importador o responsable del producto.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `8. Toda la información relacionada con esta solicitud de servicio y los productos sujetos a la inspección son propiedad del cliente y serán manejados de manera confidencial, pudiendo proporcionarse a las autoridades competentes cuando así se lo requieran a la unidad de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },
    ];

    firstPageContent.push(...considerations)

    await this.printText2Doc(doc, firstPageContent, 120, 512, 670, 195);

  }

  async addProductsCertificate(doc:jsPDF): Promise<void> {

    const globalProducts:any = [];

    this.certificate.products.forEach( ( p:ProductCertificatesResponse ) => {
      if( this.certificate.request_type === 'opinion' ) {
        globalProducts.push( ... [
          { fontSize: 12, text: `LISTADO DE PRODUCTOS CON SUS DATOS PARTICULARES`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `bold`, textAlign: `center`, color: this.blueIng },

          { fontSize: 11, text: `DESCRIPCION DEL PRODUCTO: ${p.name}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left`, color: `black` },
          { fontSize: 11, text: `MARCA: ${p.brand}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `MODELO: ${p.model}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `FOLIO: ${p.folio}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `NORMA APLICABLE: ${this.certificate.customs_rule.name} ${(this.certificate.customs_rule.phase) ? this.certificate.customs_rule.phase : ''}`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },

          { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },

        ] );

      } else {
        globalProducts.push( ... [
          { fontSize: 12, text: `LISTADO DE PRODUCTOS CON SUS DATOS PARTICULARES`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `bold`, textAlign: `center`, color: this.blueIng },

          { fontSize: 11, text: `DESCRIPCION DEL PRODUCTO: ${p.name}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left`, color: `black` },
          { fontSize: 11, text: `MARCA: ${p.brand}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `MODELO: ${p.model}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `UNIDAD DE MEDIDA: [[PENDING]]`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `CANTIDAD: ${p.total_quantity}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `TOTAL DE PRODUCTO A INSPECCIONAR: ${p.labels_to_inspecc}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `FRACCIÓN ARANCELARIA: ${p.tariff_fraction}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `FOLIO: ${p.folio}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `NORMA APLICABLE: ${this.certificate.customs_rule.name} ${(this.certificate.customs_rule.phase) ? this.certificate.customs_rule.phase : ''}`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },

          { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },

        ] );

      }

    });

    globalProducts.pop();

    await this.printText2Doc(doc, globalProducts, 120, 512, 670, 195);

  }

  async generatePDF2(certi: CertificatesResponse): Promise<void> {
    this.loadingOverlayService.addLoading();

    this.certificate = certi;

    // * Generamos la intancia de un documento
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: 'letter',compress:true });

    // ! Borrar las guias
    // doc.setDrawColor(0, 255, 0); // Verde
    // doc.rect(50, 85, 512, 642, 'S'); // 'S' significa 'Stroke' (solo borde)

    // * Agregar la fuente convertida al documento
    doc.addFileToVFS("Montserrat64_Bold.ttf", Montserrat64_Bold);
    doc.addFont("Montserrat64_Bold.ttf", "Montserrat64_Bold", "normal");

    // * Agregamos el header
    await this.addImgColorsHeaderAndFooter(doc);

    // * Agregamos la informacion de la solicitud
    await this.addInfoCertificate(doc);

    // * Agregamos el listado de productos
    await this.addProductsCertificate(doc);

    doc.save(`${ (this.certificate.request_type === 'certificate') ? 'constancia'.toUpperCase() : 'dictamen'.toUpperCase() }_${ this.certificate.code }.pdf`);

    this.loadingOverlayService.removeLoading();

  }

}
