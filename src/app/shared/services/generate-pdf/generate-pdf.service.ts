import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import { CertificatesResponse, ProductCertificatesResponse } from '../../interfaces/responseCertificates.interfaces';
import { DateFormatService } from '../date-format/date-format.service';
import { LoadingOverlayService } from '../loading-overlay/loading-overlay.service';

import { Montserrat64_Bold } from "./fontsBase64/montserrat-bold";
import { ADDRESS_INGCOM, CODE_PDF, EMAIL_CONTACT, INSPECT_NUMBER, PHONE_NUMBER, STATUS_ACCEPTED, STATUS_REVIEW, TEXT_CERTIFICATE_CANCELLED, TEXT_CERTIFICATE_REVIEW, TEXT_JUMP_PAGE, TEXT_SELLO, WEB_INGCOM, WHATSAPP_NUMBER } from '../../../data/data';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

  private certificate!: CertificatesResponse;

  private blueIng: string = `#143c81`;
  private orangeIng: string = `#ec7216`;

  private fileIngcom: string = `./assets/images/logo-ingcom-pdf.png`;
  private fileSeal: string = `./assets/images/seals/Logos-Ingcom-09-SELLO-2.png`;

  constructor(
    private dateFormatService: DateFormatService,
    private loadingOverlayService: LoadingOverlayService,
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

    await this.addImg2Doc(doc, `${this.fileIngcom}`, 1, 50, 20, 208, 60);

    doc.setDrawColor(this.blueIng);
    doc.setLineWidth(1);
    doc.line(50, 85, 306, 85, 'S');

    doc.setDrawColor(this.orangeIng);
    doc.setLineWidth(1);
    doc.line(306, 85, 562, 85, 'S');

    const stringHeader = [
      { fontSize: 12, text: `UNIDAD DE INSPECCIÓN`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 270, y: 45, color: this.blueIng },
      { fontSize: 12, text: `UVNOM${INSPECT_NUMBER}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 310, y: 60, color: this.blueIng },

      { fontSize: 8, text: `Código: ${CODE_PDF}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `normal`, textAlign: `NA`, x: 440, y: 45, color: `black` },
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
      { fontSize: 9, text: `${WEB_INGCOM}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 737, color: this.blueIng },
      { fontSize: 9, text: `WhatsApp: ${WHATSAPP_NUMBER}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 748, color: this.blueIng },

      { fontSize: 9, text: `tel.: ${PHONE_NUMBER}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 470, y: 737, color: this.blueIng },
      { fontSize: 9, text: `${EMAIL_CONTACT}`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 470, y: 748, color: this.blueIng },

      { fontSize: 9, text: `dirección: ${ADDRESS_INGCOM}`, lineSpacing: 1.15, spaceAfterLine: 5, font: `helvetica`, bold: `bold`, textAlign: `NA`, x: 50, y: 759, color: `#143c81` },

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

            const spaceAfertSeal = 85;

            if (yOffset + spaceAfertSeal > maxHeightAfterFooter) {
              doc.addPage();
              await this.addImgColorsHeaderAndFooter(doc);
              yOffset = yInit;

            }

            await this.addImg2Doc(doc, `${this.fileSeal}`, 1, 206, yOffset, 200, 58);

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

      { fontSize: 11, text: `Nombre de la empresa: ${this.certificate.user.company.name}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Domicilio fiscal: ${this.certificate.user.company.tax_address}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `RFC: ${this.certificate.user.rfc}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Tipo de persona: ${ (this.certificate.user.entity_type === 'physical') ? 'Física' : 'Moral' }`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Tipo de servicio: ${ (this.certificate.request_type === 'certificate') ? 'Constancia' : 'Dictamen' }`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Norma requerida: ${this.certificate.customs_rule.name}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Fase: ${ (this.certificate.customs_rule.phase) ? this.certificate.customs_rule.phase : 'NA' }`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

    ];

    if( this.certificate.request_type === 'opinion' ) {
      const middleCertificateContentConstancia = [
        { fontSize: 11, text: `Modalidad de etiquetado: ${this.certificate.labeling_mode}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Aduana de ingreso de la mercancía: ${this.certificate.customs_office!.name}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

        { fontSize: 11, text: `Número factura: ${this.certificate.invoice_number}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

        { fontSize: 11, text: `Fecha probable de internación: ${this.dateFormatService.getMomentObj(this.certificate.entry_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Fecha de vigencia de la solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).add(30, 'days').format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
        { fontSize: 11, text: `Fecha tentativa para la inspección: ${this.dateFormatService.getMomentObj(this.certificate.scheduled_verification_date!).format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      ];

      firstPageContent.push(...middleCertificateContentConstancia);

    } else {
      const middleCertificateContentDictamen = [
        { fontSize: 11, text: `Fecha de vigencia de la solicitud: ${this.dateFormatService.getMomentObj(this.certificate.created_at).add(30, 'days').format("DD/MM/YYYY")}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      ];

      firstPageContent.push(...middleCertificateContentDictamen);
    }

    const finalCertificateContent = [
      { fontSize: 11, text: `Domicilio donde se realizará la inspección: ${this.certificate.verification_address}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 11, text: `Notas aclaratorias: ${this.certificate.clarifications}`, lineSpacing: 1.15, spaceAfterLine: 2, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `Nombre de quien realiza el trámite: ${this.certificate.applicant_name}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },


      { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `center` },
    ];

    firstPageContent.push(...finalCertificateContent);

    const considerationsCertificate = [
      { fontSize: 9, text: `Consideraciones`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 9, text: `1. La empresa solicita este servicio y se compromete a cancelar la totalidad de la solicitud o alguno de los folios, en caso de que no sean requeridos.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `2. La presente solicitud de servicio tiene una vigencia de 30 días naturales a partir de la fecha de emisión. Transcurrido este periodo, el cliente no deberá utilizarla.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `3. La aceptación de esta solicitud implica que el cliente está de acuerdo con lo establecido en el contrato de prestación de servicios.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `4. El cliente se compromete a apegarse a los ordenamientos legales vigentes al momento de la emisión de esta solicitud de servicio, de acuerdo con el servicio solicitado (Constancia).`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `5. La veracidad de la información contenida en las etiquetas, empaques, envases, instructivos, garantías, y demás, es responsabilidad exclusiva del importador o del responsable del producto.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `6. Toda la información relacionada con esta solicitud de servicio y los productos sujetos a inspección es propiedad del cliente y será manejada de manera confidencial. No obstante, dicha información podrá ser proporcionada a las autoridades competentes cuando así lo requieran a la unidad de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },
    ];

    const considerationsOpinion = [
      { fontSize: 9, text: `Consideraciones`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 9, text: `1. La empresa solicita este servicio y se compromete a cancelar la totalidad de la solicitud, o alguno de los folios, en caso de que no sean requeridos.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `2. La presente solicitud de servicio tiene una vigencia de 30 días naturales a partir de la fecha de emisión. Transcurrido este periodo, no deberá ser utilizada por el importador.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `3. La aceptación de esta solicitud implica que el cliente está de acuerdo con lo establecido en el contrato de prestación de servicios.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `4. El cliente se compromete a apegarse a lo establecido en los ordenamientos legales vigentes al momento de la emisión de esta solicitud de servicio, de acuerdo con el servicio solicitado (Dictamen). En el caso del dictamen, la fecha programada para la inspección no podrá ser posterior a treinta días naturales contados a partir de la importación de las mercancías (desaduanamiento de las mercancías).`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `5. Los servicios de inspección que se realicen en la Ciudad de México podrán incluir viáticos para alimentación o traslado, los cuales deberán ser cubiertos por la empresa.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `6. Para los servicios de inspección que se realicen fuera de la Ciudad de México, se informa que la empresa deberá cubrir los viáticos requeridos, relacionados con transportación, hospedaje y alimentación, los cuales son necesarios para la realización de la visita de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `7. La veracidad de la información contenida en etiquetas, empaques, envases, instructivos, garantías, entre otros, es responsabilidad exclusiva del importador o del responsable del producto.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },
      { fontSize: 9, text: `8. Toda la información relacionada con esta solicitud de servicio y los productos sujetos a inspección es propiedad del cliente y será manejada de manera confidencial. Sin embargo, podrá ser proporcionada a las autoridades competentes cuando así lo requieran a la unidad de inspección.`, lineSpacing: 1.15, spaceAfterLine: 0, font: `helvetica`, bold: `normal`, textAlign: `left` },

      { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },
    ];

    if( this.certificate.request_type === 'opinion' ) {
      firstPageContent.push(...considerationsOpinion);
    } else {
      firstPageContent.push(...considerationsCertificate);
    }


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

          { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 50, font: `helvetica`, bold: `normal`, textAlign: `center` },

          { fontSize: 11, text: `${TEXT_JUMP_PAGE}`, lineSpacing: 1.15, spaceAfterLine: 100, font: `helvetica`, bold: `normal`, textAlign: `center` },

        ] );

      } else {
        globalProducts.push( ... [
          { fontSize: 12, text: `LISTADO DE PRODUCTOS CON SUS DATOS PARTICULARES`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `bold`, textAlign: `center`, color: this.blueIng },

          { fontSize: 11, text: `DESCRIPCION DEL PRODUCTO: ${p.name}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left`, color: `black` },
          { fontSize: 11, text: `MARCA: ${p.brand}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `MODELO: ${p.model}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `UNIDAD DE MEDIDA: ${p.unit_measurement.name}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `CANTIDAD: ${p.total_quantity}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `TOTAL DE PRODUCTO A INSPECCIONAR: ${p.labels_to_inspecc}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `FRACCIÓN ARANCELARIA: ${p.tariff_fraction}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },
          { fontSize: 11, text: `FOLIO: ${p.folio}`, lineSpacing: 1.15, spaceAfterLine: 10, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `NORMA APLICABLE: ${this.certificate.customs_rule.name} ${(this.certificate.customs_rule.phase) ? this.certificate.customs_rule.phase : ''}`, lineSpacing: 1.15, spaceAfterLine: 30, font: `helvetica`, bold: `normal`, textAlign: `left` },

          { fontSize: 11, text: `${TEXT_SELLO}`, lineSpacing: 1.15, spaceAfterLine: 50, font: `helvetica`, bold: `normal`, textAlign: `center` },

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
