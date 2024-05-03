import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent implements OnInit, OnDestroy {

  public tabs: Product[] = [];
  public selectedIndex: number = 0;
  private arrSubs: Subscription[] = [];

  constructor(
    private requestService: RequestService,
  ) {
    this.tabs.push({ unit_measurement_id: 0, name: '', brand: '', model: '', invoice: '', total_quantity: 0, labels_to_inspecc: 0, tariff_fraction: ''});

  }

  ngOnInit(): void {
    if(this.requestService.productsRequestData.length > 0) {
      this.tabs = this.requestService.productsRequestData;
      this.requestService.setProducts( this.tabs );
    }

    this.selectedIndex = this.requestService.index;
    this.arrSubs.push(
      this.requestService.getIndex.subscribe({
        next: (i:number) => {
          this.selectedIndex = i;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.arrSubs.forEach( (s:Subscription) => s.unsubscribe() );
  }

  addTab() {
    this.tabs.push({ unit_measurement_id: 0, name: '', brand: '', model: '', invoice: '', total_quantity: 0, labels_to_inspecc: 0, tariff_fraction: '' });
    this.selectedIndex = this.tabs.length-1;
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.requestService.setProducts( this.tabs );
  }

  changeIndex(value: number): void {
    this.selectedIndex += value;
  }

  goBack(): void {
    this.requestService.productsRequestData = this.tabs
    this.requestService.setOption(0);
  }

  handlerSendProducts(value: boolean): void {
    if(value) {
      this.requestService.setProducts( this.tabs );
    }
  }

}
