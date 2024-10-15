import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { RequestService } from '../../services/request/request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MeasurementAllMeasurements } from '../../interfaces/responseAllMeasurements.interface';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrl: './product-tab.component.scss'
})
export class ProductTabComponent implements OnInit, OnChanges {

  // @Input() public product!: Product;
  @Input() public unitsMeasurements: MeasurementAllMeasurements[] = [];
  @Input() public productIndex = -1;
  @Input() public productRecieved!: Product;
  @Output() public eventSendProducts: EventEmitter<[boolean, Product]> = new EventEmitter();
  public productTabForm: FormGroup;
  public product!: Product;
  public typeForm: number = -1;

  constructor(
    private requestService: RequestService,
  ) {
    this.productTabForm = new FormGroup({
      brand: new FormControl(null, [Validators.required]),
      // invoice: new FormControl(null, [Validators.required]),
      labels_to_inspecc: new FormControl(null),
      model: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      tariff_fraction: new FormControl(null),
      total_quantity: new FormControl(null),
      unit_measurement_id: new FormControl(null),
    });

  }

  ngOnInit(): void {
    this.typeForm = this.requestService.formRequestData.type;
    this.handlerNewValidators();
  }

  handlerNewValidators(): void {
    const controls = [
      'unit_measurement_id',
      'total_quantity',
      'labels_to_inspecc',
      'tariff_fraction',
    ];

    if (this.typeForm === 1) {
      controls.forEach( (c:string) => {
        this.productTabForm.get(c)!.clearValidators();
        this.productTabForm.get(c)!.setValue(1);
        this.productTabForm.get(c)!.updateValueAndValidity();
      });

    } else if (this.typeForm === 2) {
      controls.forEach( (c:string) => {
        this.productTabForm.get(c)!.setValidators([Validators.required]);
        this.productTabForm.get(c)!.updateValueAndValidity();
      });

    }

    this.productTabForm.updateValueAndValidity();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['productRecieved'] && changes['productRecieved'].currentValue){
      const p: Product = changes['productRecieved'].currentValue;

      this.productTabForm.patchValue({
        brand: p.brand,
        labels_to_inspecc: p.labels_to_inspecc,
        model: p.model,
        name: p.name,
        tariff_fraction: p.tariff_fraction,
        total_quantity: p.total_quantity,
        unit_measurement_id: p.unit_measurement_id,
      });

      this.checkIfICanSedProduct2Autocomplete();
    }

  }

  fillProductWithFormValues() {
    this.product = {
      brand: this.productTabForm.get('brand')!.value,
      // invoice: this.productTabForm.get('invoice')!.value,
      labels_to_inspecc: this.productTabForm.get('labels_to_inspecc')!.value,
      model: this.productTabForm.get('model')!.value,
      name: this.productTabForm.get('name')!.value,
      tariff_fraction: this.productTabForm.get('tariff_fraction')!.value,
      total_quantity: this.productTabForm.get('total_quantity')!.value,
      unit_measurement_id: this.productTabForm.get('unit_measurement_id')!.value,
      index: this.productIndex,
    };
  }

  checkIfICanSedProduct2Autocomplete(): void {
    this.fillProductWithFormValues();

    if( this.productTabForm.valid ) {
      this.eventSendProducts.emit([true, this.product]);
    } else {
      this.eventSendProducts.emit([false, this.product]);
    }

  }

}
