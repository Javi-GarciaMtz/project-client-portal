import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { RequestService } from '../../services/request/request.service';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrl: './product-tab.component.scss'
})
export class ProductTabComponent implements OnInit {

  @Input() public product!: Product;
  @Output() public eventSendProducts: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private requestService: RequestService,
  ) {}

  ngOnInit(): void {}

  checkIfICanSedProduct2Autocomplete(): void {
    if(
      this.product.brand !== '' &&
      this.product.invoice !== '' &&
      this.product.labels_to_inspecc > 0 &&
      this.product.model !== '' &&
      this.product.name !== '' &&
      this.product.tariff_fraction !== '' &&
      this.product.total_quantity > 0 &&
      this.product.unit_measurement_id > 0
    ) {
      this.eventSendProducts.emit(true);
    }

  }

}
