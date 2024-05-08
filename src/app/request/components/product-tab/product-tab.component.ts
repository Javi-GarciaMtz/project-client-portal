import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { RequestService } from '../../services/request/request.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MeasurementAllMeasurements } from '../../interfaces/responseAllMeasurements.interface';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrl: './product-tab.component.scss'
})
export class ProductTabComponent implements OnInit {

  // @Input() public product!: Product;
  @Input() public unitsMeasurements: MeasurementAllMeasurements[] = [];
  @Input() public productIndex = -1;
  @Output() public eventSendProducts: EventEmitter<[boolean, Product]> = new EventEmitter();
  public productTabForm: FormGroup;
  public product!: Product;

  constructor(
    private requestService: RequestService,
  ) {
    this.productTabForm = new FormGroup({
      brand: new FormControl(null, [Validators.required]),
      invoice: new FormControl(null, [Validators.required]),
      labels_to_inspecc: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      tariff_fraction: new FormControl(null, [Validators.required]),
      total_quantity: new FormControl(null, [Validators.required]),
      unit_measurement_id: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  fillProductWithFormValues() {
    this.product = {
      brand: this.productTabForm.get('brand')!.value,
      invoice: this.productTabForm.get('invoice')!.value,
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
