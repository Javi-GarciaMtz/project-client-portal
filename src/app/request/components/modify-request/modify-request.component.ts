import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { CustomsRuleUser, User } from '../../../auth/interfaces/user.interface';
import { CustomOfficeAllCustoms } from '../../interfaces/responseAllCustomsOffices.interface';
import moment from 'moment';
import { RequestService } from '../../services/request/request.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { CertificatesResponse } from '../../../shared/interfaces/responseCertificates.interfaces';
import { forkJoin, Subscription } from 'rxjs';
import { NOM051SCFISSA12010_FASE2_ID, NOM051SCFISSA12010_FASE3_ID } from '../../../data/data';
import { MatDialogRef } from '@angular/material/dialog';
import { ModifyStatusCertificateComponent } from '../../../shared/components/modify-status-certificate/modify-status-certificate.component';
import { ResponseUpdateOnlyCertificate } from '../../interfaces/responseUpdateOnlyCertificate.interface';

@Component({
  selector: 'app-modify-request',
  templateUrl: './modify-request.component.html',
  styleUrl: './modify-request.component.scss'
})
export class ModifyRequestComponent implements OnInit, OnDestroy {

  @Input() public dialogRef!: MatDialogRef<ModifyRequestComponent>;
  @Input() public certificate!: CertificatesResponse;

  private arrSubs: Subscription[] = [];

  public formModifyRequest: FormGroup;
  public titleRequest: string = 'Constancia';
  public typeForm: number = 1;

  public user!: User;
  public company!: CompanyAllCompanies;

  public rules: CustomsRuleUser[] = [];
  public phases51: CustomsRuleUser[] = [];

  public customsOffices: CustomOfficeAllCustoms[] = [];

  public minDate!: Date;
  public maxDate!: Date;

  constructor(
    private requestService: RequestService,
    private storageService: StorageService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
  ) {
    // * Seteamos el limite de seleccion de la fecha
    const today = moment(); // * Fecha actual
    this.minDate = today.toDate(); // * Convierte la fecha actual a un objeto Date
    this.maxDate = today.add(30, 'days').toDate(); // * Agrega 30 días a la fecha actual y convierte a Date

    this.user = this.storageService.retrieveAndDecryptUser();

    this.formModifyRequest = new FormGroup({
      type: new FormControl(1, [Validators.required]),
      inspectionAddress: new FormControl(null, [Validators.required]),

      rule: new FormControl(null, [Validators.required]),
      phaseNom051: new FormControl(null),

      customsOfEntry: new FormControl(null),
      labelingMode: new FormControl(null),
      invoiceNumber: new FormControl(null),

      probableInternmentDate: new FormControl(null),
      tentativeInspectionDate: new FormControl(null),

      clarifications: new FormControl(null, [Validators.required])
    });

  }

  ngOnInit(): void {
    // * Traemos los datos de la compañia y de las reglas
    this.arrSubs.push(
      forkJoin({
        companies: this.requestService.getAllCompanies(),
        customsOffices: this.requestService.getAllCustomsOffices(),
      }).subscribe({
        next: (r: any) => {
          // * Guardamos la informacion
          this.company = r.companies.data.find((c:CompanyAllCompanies) => c.id === this.user.user.company_id)!;
          this.customsOffices = r.customsOffices.data;

          // * Procesamos las normas
          this.proccessRules();

          // this.loadingOverlayService.removeLoading();
        },
        error: (e: any) => {
          // console.log('error', e);
          this.toastService.showSnackbar(false, 'Error desconocido. (CODE: 001)', 7000);
          // this.loadingOverlayService.removeLoading();
        }
      })
    );

    // * Deshabilitamos el select de la fase
    this.formModifyRequest.get('phaseNom051')!.disable();

    // * Pre cargar la informacion del data que se manda al modificar
    this.uploadCertificateData();

    // * Enviamos la info de la solicitud a la pestaña de productos
    this.requestService.formRequestData = {
      type: ( this.certificate.request_type === 'certificate' ) ? 1 : 2,
      inspectionAddress: this.certificate.verification_address,
      rule: this.certificate.customs_rule_id,
      phaseNom051: null,
      customsOfEntry: null,
      labelingMode: null,
      invoiceNumber: null,
      probableInternmentDate: null,
      tentativeInspectionDate: null,
      clarifications: ''
    };

  }

  ngOnDestroy(): void {

  }

  onSubmit(): void {
    this.loadingOverlayService.addLoading();
    this.formModifyRequest.controls[`inspectionAddress`].enable();
    this.arrSubs.push(
      this.requestService.updateOnlyRequest(this.formModifyRequest.value, this.certificate.id, this.typeForm).subscribe({
        next: (res: ResponseUpdateOnlyCertificate) => {
          this.formModifyRequest.controls[`inspectionAddress`].disable();
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(true, res.data.message, 7000);
          this.dialogRef.close(['certificate', this.certificate, this.formModifyRequest.value]);

        },
        error: (e: any) => {
          this.formModifyRequest.controls[`inspectionAddress`].disable();
          this.loadingOverlayService.removeLoading();
          this.toastService.showSnackbar(false, `Error desconocido al actualizar la solicitud. (UNKNOWN 001)`, 7000);

        }
      })
    );
  }

  uploadCertificateData(): void {
    // * LLenamos el domicilio de inspeccion
    this.formModifyRequest.controls[`inspectionAddress`].setValue(this.certificate.verification_address);
    this.formModifyRequest.controls[`inspectionAddress`].disable();

    // * Llenamos la norma y verificamos si el form tenia la norma 51
    this.formModifyRequest.controls[`rule`].setValue( ( this.certificate.customs_rule_id === NOM051SCFISSA12010_FASE2_ID || this.certificate.customs_rule_id === NOM051SCFISSA12010_FASE3_ID) ? 51 : this.certificate.customs_rule_id );
    if( this.certificate.customs_rule_id === NOM051SCFISSA12010_FASE2_ID || this.certificate.customs_rule_id === NOM051SCFISSA12010_FASE3_ID) {
      this.formModifyRequest.controls['rule'].setValue(51);
      this.changeRule();
      this.formModifyRequest.controls['phaseNom051'].setValue( this.certificate.customs_rule_id );
    }

    // * LLenamos la aduana de ingreso
    this.formModifyRequest.controls[`customsOfEntry`].setValue( (this.certificate.customs_office) ? this.certificate.customs_office.id : null );

    // * LLenamos la modalidad de etiquetado
    this.formModifyRequest.controls[`labelingMode`].setValue( (this.certificate.labeling_mode) ? this.certificate.labeling_mode : null );

    // * LLenamos el numero de factura
    this.formModifyRequest.controls[`invoiceNumber`].setValue( (this.certificate.invoice_number) ? this.certificate.invoice_number : null );

    // * LLenamos la fecha probable de inspeccion
    if( this.certificate.entry_date ) {
      const momentDate2 = moment(this.certificate.entry_date, 'YYYY-MM-DD');
      this.formModifyRequest.controls[`tentativeInspectionDate`].setValue( momentDate2.toDate() );
    }

    // * LLenamos la fecha probable de internacion
    if( this.certificate.scheduled_verification_date ) {
      const momentDate2 = moment(this.certificate.scheduled_verification_date, 'YYYY-MM-DD');
      this.formModifyRequest.controls[`probableInternmentDate`].setValue( momentDate2.toDate() );
    }

    // * LLenamos las aclaraciones
    this.formModifyRequest.controls[`clarifications`].setValue(this.certificate.clarifications);

    // * Llenamos el tipo de form
    this.formModifyRequest.controls['type'].setValue( ( this.certificate.request_type === 'certificate' ) ? 1 : 2 );
    this.changeTypeForm();

  }

  // * Manejo del evento de cuando hay nuevos validadores, es decir ahora hay mas campos que debe o no, ser obligatorios
  handlerNewValidators(): void {
    const controls = [
      'customsOfEntry',
      'labelingMode',
      'invoiceNumber',
      'probableInternmentDate',
      'tentativeInspectionDate'
    ];

    if (this.typeForm === 1) {
      controls.forEach( (c:string) => {
        this.formModifyRequest.get(c)!.clearValidators();
        this.formModifyRequest.get(c)!.setValue(null);
        this.formModifyRequest.get(c)!.updateValueAndValidity();
      });

    } else if (this.typeForm === 2) {
      controls.forEach( (c:string) => {
        this.formModifyRequest.get(c)!.setValidators([Validators.required]);
        this.formModifyRequest.get(c)!.updateValueAndValidity();
      });

    }
    this.formModifyRequest.updateValueAndValidity();

  }

  // * Manejo del evento que maneja el cambio de una constancia a dictamen, y viceversa
  changeTypeForm(): void {
    const type = this.formModifyRequest.get('type')!.value;
    this.typeForm = type;

    if(type === 1) {
      this.titleRequest = 'Constancia';
    } else if(type === 2){
      this.titleRequest = 'Dictamen';
    }
    this.handlerNewValidators();

  }

   // * Manejo del evento cuando se cambia la norma, si la norma es la 051, habilitamos el select de las fases y revisamos de nuevo los validadores
   changeRule(): void {
    const ruleId = this.formModifyRequest.get('rule')!.value;
    const nom51 = this.formModifyRequest.get('phaseNom051')!;
    if( ruleId === 51 ) {
      nom51.enable();
      nom51.setValue(null);
      nom51.setValidators([Validators.required]);
      nom51.updateValueAndValidity();
    } else {
      nom51.disable();
      nom51.setValue(null);
      nom51.clearValidators();
      nom51.updateValueAndValidity();
    }
    this.formModifyRequest.updateValueAndValidity();

  }

  // * Se precesan las normas, de manera que las normas 051 creamos solo una norma 051 y en las fases estan directamente las dos normas
  proccessRules(): void {
    const nameRule51 = 'NOM-051-SCFI/SSA1-2010';
    const userRules = this.user.customs_rules;
    const rules51 = userRules.filter(rule => rule.name === nameRule51 );

    // * Actualizamos las normas que tiene disponible el usuario
    this.rules = userRules;

    // * Si el usuario tiene normas 51 disponibles, las mostramos
    if( rules51.length > 0 ) {
      // * Quitamos todas las normas 51
      this.rules = this.rules.filter((r:any) => r.name !== nameRule51);
      // * Agregamos solo una norma 51, con el id 51
      this.rules.push({ id: 51, name: "NOM-051-SCFI/SSA1-2010", phase: null, description: null, status: '', created_at:  ``, updated_at:  ``, pivot: { user_id: -1, custom_rule_id: -2 } });
      // * Ordenamos por nombre de las normas
      this.rules.sort((a:any, b:any) => {
        const yearA = parseInt(a.name.split("-").pop()!);
        const yearB = parseInt(b.name.split("-").pop()!);
        return yearA - yearB;
      });
      // * Agregamos las fases de la 51
      this.phases51 = rules51;
    }

  }

  cancel(): void {
    this.dialogRef.close(-1);
  }

  checkSubmit(): boolean {
    return false;
  }

}
