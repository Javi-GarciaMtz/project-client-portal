import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Subscription, forkJoin } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { Company, ResponseAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Rule } from '../../../admin/interfaces/responseAllRules.interface';
import { nom_51_phases } from '../../../environments/environments';

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
  public company!: Company;
  public rules: Rule[] = [];
  public phases51: any[] = nom_51_phases;

  constructor(
    private requestService: RequestService,
    private storageService: StorageService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
  ) {
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

    this.arrSubs.push(
      forkJoin({
        companies: this.requestService.getAllCompanies(),
        rules: this.requestService.getAllRules(),
      }).subscribe({
        next: (r: any) => {
          // console.log('respons', r);

          this.rules = r.rules.data;
          this.company = r.companies.data.find((c:Company) => c.id === this.user.user.company_id)!;

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

    this.formCreateRequest.get('phaseNom051')!.disable();

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

  onSubmit(): void {
    this.requestService.formRequestData = this.formCreateRequest.value;
    this.requestService.setOption(1);

  }

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
    this.formCreateRequest.updateValueAndValidity();

  }

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

  proccessRules(): void {
    this.rules = this.rules.filter((r:Rule) => r.name !== "NOM-051-SCFI/SSA1-2010");
    this.rules.push({ id: 51, name: "NOM-051-SCFI/SSA1-2010", phase: null, description: null, status: '', created_at:  ``, updated_at:  `` });
    this.rules.sort((a:Rule, b:Rule) => {
      const yearA = parseInt(a.name.split("-").pop()!);
      const yearB = parseInt(b.name.split("-").pop()!);
      return yearA - yearB;
    });

  }

}
