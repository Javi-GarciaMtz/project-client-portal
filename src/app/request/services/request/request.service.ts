import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../../../shared/interfaces/company.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url_customs_gen } from '../../../environments/environments';
import { ResponseAllCompanies } from '../../interfaces/responseAllCompanies.interface';
import { ResponseAllRules } from '../../interfaces/responseAllRules.interface';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { FormRequest } from '../../interfaces/formRequest.interface';
import { Product } from '../../interfaces/product.interface';

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
  ) { }

  get option(): number { return this._option; }
  get getOption(): Observable<number> { return this.optionSubject.asObservable(); }
  setOption(value: number): void {
    this._option = value;
    this.optionSubject.next( this._option );
  }

  get products(): Product[] { return this._products; }
  get getProducts(): Observable<Product[]> { return this.productsSubject.asObservable(); }
  setProducts(prod: Product[]): void {
    this._products = prod;
    this.productsSubject.next( this._products );
  }

  get index(): number { return this._index; }
  get getIndex(): Observable<number> { return this.indexSubject.asObservable(); }
  setIndex(value: number): void {
    this._index = value;
    this.indexSubject.next( this._index );
  }

  set formRequestData(form: FormRequest) { this._formRequestData = form; }
  get formRequestData(): FormRequest { return this._formRequestData; }

  resetFormRequestData(): void {
    this._formRequestData = { type: -1, inspectionAddress: '', rule: -2, phaseNom051: null, customsOfEntry: null, labelingMode: null, invoiceNumber: null, probableInternmentDate: null, tentativeInspectionDate: null, clarifications: '' };
  }

  set productsRequestData(produts: Product[]) { this._productsRequestData = produts; }
  get productsRequestData(): Product[] { return this._productsRequestData; }

  // ? Http Petitions

  getAllCompanies(): Observable<ResponseAllCompanies> {
    const url = `${url_customs_gen}companies`;
    return this.http.get<ResponseAllCompanies>(url);
  }

  getAllRules(): Observable<ResponseAllRules> {
    const url = `${url_customs_gen}customs-rules`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.retrieveAndDecryptUser().token}`
      })
    };

    return this.http.get<ResponseAllRules>(url, httpOptions);
  }

}
