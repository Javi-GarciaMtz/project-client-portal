import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../../../shared/interfaces/company.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url_customs_gen } from '../../../environments/environments';
import { ResponseAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { FormRequest } from '../../interfaces/formRequest.interface';
import { Product } from '../../interfaces/product.interface';
import { DateFormatService } from '../../../shared/services/date-format/date-format.service';
import { ResponseAllCustomsOffices } from '../../interfaces/responseAllCustomsOffices.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private _option: number = 0;
  private optionSubject = new Subject<number>();

  private _products: Product[] = [];
  private productsSubject = new Subject<Product[]>();

  private _index: number = 0;
  private indexSubject = new Subject<number>();

  private _formRequestData: FormRequest = { type: -1, inspectionAddress: '', rule: -2, phaseNom051: null, customsOfEntry: null, labelingMode: null, invoiceNumber: null, probableInternmentDate: null, tentativeInspectionDate: null, clarifications: '' };
  private _productsRequestData: Product[] = [];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private dateFormaService: DateFormatService,
  ) { }

  // * Metodos para el control de si se muestra la parte de hacer la solicitud, o el añadir productos
  get option(): number { return this._option; }
  get getOption(): Observable<number> { return this.optionSubject.asObservable(); }
  setOption(value: number): void {
    this._option = value;
    this.optionSubject.next( this._option );
  }

  // * Metodos para el control de la informacion del arreglo de productos capturado por el usuario
  get products(): Product[] { return this._products; }
  get getProducts(): Observable<Product[]> { return this.productsSubject.asObservable(); }
  setProducts(prod: Product[]): void {
    this._products = prod;
    this.productsSubject.next( this._products );
  }

  // * Metodos para el control del indice de las tabs de productos, para cambiar entre indices cuando se usa el autocomplete
  get index(): number { return this._index; }
  get getIndex(): Observable<number> { return this.indexSubject.asObservable(); }
  setIndex(value: number): void {
    this._index = value;
    this.indexSubject.next( this._index );
  }

  // * Metodos para la persistencia de la informacion de la solicitud capturada por el usuario
  set formRequestData(form: FormRequest) { this._formRequestData = form; }
  get formRequestData(): FormRequest { return this._formRequestData; }

  resetFormRequestData(): void {
    this._formRequestData = { type: -1, inspectionAddress: '', rule: -2, phaseNom051: null, customsOfEntry: null, labelingMode: null, invoiceNumber: null, probableInternmentDate: null, tentativeInspectionDate: null, clarifications: '' };
  }

  // * Metodos para la persistencia de la informacion de los productos capturados por el usuario
  set productsRequestData(produts: Product[]) { this._productsRequestData = produts; }
  get productsRequestData(): Product[] { return this._productsRequestData; }

  // * --------------> Http Petitions <--------------

  // * Metodo para obtener todas las compañias al hacer una solicitud
  getAllCompanies(): Observable<ResponseAllCompanies> {
    const url = `${url_customs_gen}companies`;
    return this.http.get<ResponseAllCompanies>(url);
  }

  // * Metodo para obtener las aduanas
  getAllCustomsOffices(): Observable<ResponseAllCustomsOffices> {
    const url = `${url_customs_gen}customs-offices`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.get<ResponseAllCustomsOffices>(url, httpOptions);
  }

  // * Metodo para guarda la solicitud
  saveRequest(dataRequest: FormRequest, products: Product[]) {
    const user = this.storageService.retrieveAndDecryptUser();
    const entryDate = this.dateFormaService.getMomentObj(dataRequest.tentativeInspectionDate!);
    const scheVeriDate = this.dateFormaService.getMomentObj(dataRequest.probableInternmentDate!);
    const data = {
      user_id: user.user.id,
      company_id: user.user.company_id,

      customs_rule_id: dataRequest.rule,
      customs_office_id: dataRequest.customsOfEntry,

      applicant_name: `${user.user.name} ${user.user.middle_name}`,
      verification_address: dataRequest.inspectionAddress,

      labeling_mode: dataRequest.labelingMode,
      request_type: ``,

      invoice_number: dataRequest.invoiceNumber,
      entry_date: entryDate.format("YYYY-MM-DD"),

      scheduled_verification_date: scheVeriDate.format("YYYY-MM-DD"),
      clarifications: dataRequest.clarifications,

      products: products
    };

    console.log('To send', data);

  }

}
