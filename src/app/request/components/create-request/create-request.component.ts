import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { Company, ResponseAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrl: './create-request.component.scss'
})
export class CreateRequestComponent implements OnInit, OnDestroy{

  private arrSubs: Subscription[] = [];
  public formCreateRequest: FormGroup;
  public titleRequest: string = 'Constancia';
  public typeForm: number = 1;
  public user: User;
  public company!: Company;

  constructor(
    private requestService: RequestService,
    private storageService: StorageService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
  ) {
    this.user = this.storageService.retrieveAndDecryptUser();
    this.formCreateRequest = new FormGroup({
      type: new FormControl(1, [Validators.required]),
    });

  }

  ngOnInit(): void {
    this.loadingOverlayService.addLoading();
    this.requestService.getAllCompanies().subscribe({
      next: (r: ResponseAllCompanies) => {
        this.company = r.data.find((c:Company) => c.id === this.user.user.company_id)!;
        this.loadingOverlayService.removeLoading();
      },
      error: (e: any) => {
        this.toastService.showSnackbar(false, `Error desconocido, intente más tarde. (CODE: 001)`, 5000);
      }
    });

  }

  ngOnDestroy(): void {

  }

  onSubmit(): void {
    this.requestService.setOption(1);
  }

  changeTypeForm(): void {
    const type = this.formCreateRequest.get('type')!.value;
    this.typeForm = type;
    if(type === 1) {
      this.titleRequest = 'Constancia';
    } else if(type === 2){
      this.titleRequest = 'Dictamen';
    }

  }

}
