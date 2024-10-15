import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Subscription, forkJoin } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { CustomsRuleUser, User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { CompanyAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { CustomOfficeAllCustoms } from '../../interfaces/responseAllCustomsOffices.interface';
import moment from 'moment';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent implements OnInit, OnDestroy, DoCheck{

  private arrSubs: Subscription[] = [];

  public formCreateRequest: FormGroup;
  public titleRequest: string = 'Constancia';
  public typeForm: number = 1;

  public user: User;
  public company!: CompanyAllCompanies;

  public rules: CustomsRuleUser[] = [];
  public phases51: CustomsRuleUser[] = [];

  public customsOffices: CustomOfficeAllCustoms[] = [];

  public minDate: Date;
  public maxDate: Date;

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
    this.formCreateRequest = new FormGroup({
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
    this.loadingOverlayService.addLoading();

    this.setInspectionAddress(1);

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

          this.loadingOverlayService.removeLoading();
        },
        error: (e: any) => {
          console.log('error', e);
          this.toastService.showSnackbar(false, 'Error desconocido. (CODE: 001)', 7000);
          // this.loadingOverlayService.removeLoading();
        }
      })
    );

    // * Deshabilitamos el select de la fase
    this.formCreateRequest.get('phaseNom051')!.disable();

    // * Si ya existen datos de una solicitud previa
    if( this.requestService.formRequestData.type !== -1 ) {
      this.formCreateRequest.patchValue( this.requestService.formRequestData );
      if( this.requestService.formRequestData.rule === 51 ) {
        this.formCreateRequest.get('phaseNom051')!.enable();
      }
    }

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  ngDoCheck(): void {}

  // * Manejo del evento de continuar con la solicitud
  onSubmit(): void {
    this.requestService.formRequestData = {
      ... this.formCreateRequest.value,
      inspectionAddress: this.formCreateRequest.get('inspectionAddress')!.value
    };
    this.requestService.setOption(1);

  }

  setInspectionAddress(typeForm: number): void {
    const inspectionAddress = this.formCreateRequest.get('inspectionAddress')!;
    inspectionAddress.clearValidators();

    if( typeForm === 1 ) {
      inspectionAddress.setValue('INGCOM');
      inspectionAddress.disable();
    } else if ( this.typeForm === 2 ) {
      inspectionAddress.setValue(null);
      inspectionAddress.enable();
    }

    inspectionAddress.updateValueAndValidity();

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
        this.formCreateRequest.get(c)!.clearValidators();
        this.formCreateRequest.get(c)!.setValue(null);
        this.formCreateRequest.get(c)!.updateValueAndValidity();
      });

    } else if (this.typeForm === 2) {
      controls.forEach( (c:string) => {
        this.formCreateRequest.get(c)!.setValidators([Validators.required]);
        this.formCreateRequest.get(c)!.updateValueAndValidity();
      });

    }

    this.setInspectionAddress(this.typeForm);

    this.formCreateRequest.updateValueAndValidity();

  }

  // * Manejo del evento que maneja el cambio de una constancia a dictamen, y viceversa
  changeTypeForm(): void {
    const type = this.formCreateRequest.get('type')!.value;
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
    const ruleId = this.formCreateRequest.get('rule')!.value;
    const nom51 = this.formCreateRequest.get('phaseNom051')!;
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
    this.formCreateRequest.updateValueAndValidity();

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

}
