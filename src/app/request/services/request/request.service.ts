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
import { ResponseAllMeasurements } from '../../interfaces/responseAllMeasurements.interface';
import { ResponseCreateCertificate } from '../../interfaces/responsesCreateCertificate.interface';
import { ResponseUpdateOnlyCertificate } from '../../interfaces/responseUpdateOnlyCertificate.interface';
import { ResponseDeleteProduct } from '../../interfaces/responseDeleteProduct.interface';
import { ResponseUpdateProduct } from '../../interfaces/responseUpdateProduct.interface';

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

  private _restartTable: boolean = false;
  private restartTableSubject = new Subject<boolean>();

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

  // * Metodos para el control de cuando se necesita volver a cargar todo el mat table
  get restartTable(): boolean { return this._restartTable; }
  get getRestartTable(): Observable<boolean> { return this.restartTableSubject.asObservable(); }
  setRestartTable(value: boolean): void {
    this._restartTable = value;
    this.restartTableSubject.next( this._restartTable );
  }

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

  // * Metodo para obtener las unidades de medida
  getAllMeasurements(): Observable<ResponseAllMeasurements> {
    const url = `${url_customs_gen}units-measurements`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.get<ResponseAllMeasurements>(url, httpOptions);
  }

  // * Metodo para guarda la solicitud
  saveRequest(dataRequest: FormRequest, products: Product[]): Observable<ResponseCreateCertificate> {
    const user = this.storageService.retrieveAndDecryptUser();
    const entryDate = (dataRequest.tentativeInspectionDate) ? this.dateFormaService.getMomentObj(dataRequest.tentativeInspectionDate).format("YYYY-MM-DD") : null;
    const scheVeriDate = (dataRequest.probableInternmentDate) ? this.dateFormaService.getMomentObj(dataRequest.probableInternmentDate).format("YYYY-MM-DD") : null;
    const customRuleId = ( dataRequest.rule === 51 ) ? dataRequest.phaseNom051 : dataRequest.rule;
    const body = {
      user_id: user.user.id,
      company_id: user.user.company_id,

      customs_rule_id: customRuleId,
      customs_office_id: dataRequest.customsOfEntry,

      applicant_name: `${user.user.name} ${user.user.middle_name}`,
      verification_address: dataRequest.inspectionAddress,

      labeling_mode: dataRequest.labelingMode,
      request_type: (dataRequest.type === 1) ? `certificate` : `opinion`,

      invoice_number: dataRequest.invoiceNumber,
      entry_date: entryDate,

      scheduled_verification_date: scheVeriDate,
      clarifications: dataRequest.clarifications,

      products: products
    };

    const url = `${url_customs_gen}certificate/store`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseCreateCertificate>(url, body, { headers: headers });

  }

  // * Metodo para actualizar SOLO la solicitud
  updateOnlyRequest(dataRequest: FormRequest, idCertificate: number, typeForm: number): Observable<ResponseUpdateOnlyCertificate> {
    const user = this.storageService.retrieveAndDecryptUser();
    const entryDate = (dataRequest.tentativeInspectionDate) ? this.dateFormaService.getMomentObj(dataRequest.tentativeInspectionDate).format("YYYY-MM-DD") : null;
    const scheVeriDate = (dataRequest.probableInternmentDate) ? this.dateFormaService.getMomentObj(dataRequest.probableInternmentDate).format("YYYY-MM-DD") : null;
    const customRuleId = ( dataRequest.rule === 51 ) ? dataRequest.phaseNom051 : dataRequest.rule;

    const body = {
      opinion_id: idCertificate,
      certificate_id: idCertificate,

      customs_rule_id: customRuleId,
      customs_office_id: dataRequest.customsOfEntry,

      applicant_name: `${user.user.name} ${user.user.middle_name}`,
      verification_address: dataRequest.inspectionAddress,

      labeling_mode: dataRequest.labelingMode,
      request_type: (dataRequest.type === 1) ? `certificate` : `opinion`,

      invoice_number: dataRequest.invoiceNumber,
      entry_date: entryDate,

      scheduled_verification_date: scheVeriDate,
      clarifications: dataRequest.clarifications,
    };

    const url = (typeForm === 1) ? `${url_customs_gen}certificate/update-certificate` : `${url_customs_gen}certificate/update-opinion`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.patch<ResponseUpdateOnlyCertificate>(url, body, { headers: headers });

  }

  // * Metodo para eliminar un producto
  deleteProduct(id: number): Observable<ResponseDeleteProduct> {
    const url = `${url_customs_gen}products/delete`;

    const deleteStatus = 2;
    const body = {
      product_id: id,
      status: deleteStatus
    };

    const options = {
      body: body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.request<ResponseDeleteProduct>('DELETE', url, options);
  }

  // * Metodo para actualizar un producto
  updateProduct(p: Product): Observable<ResponseUpdateProduct> {
    const url = `${url_customs_gen}products/update`;

    const body = {
      product_id: p.idDb,
      unit_measurement_id: p.unit_measurement_id,
      name: p.name,
      brand: p.brand,
      model: p.model,
      folio: p.folio,
      total_quantity: p.total_quantity,
      labels_to_inspecc: p.labels_to_inspecc,
      tariff_fraction: p.tariff_fraction
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
    });

    return this.http.patch<ResponseUpdateProduct>(url, body, { headers: headers });

  }

}
