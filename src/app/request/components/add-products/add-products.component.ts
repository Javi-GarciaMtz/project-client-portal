import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request/request.service';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

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
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService,
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

    this.setIndexTabs();

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach( (s:Subscription) => s.unsubscribe() );
  }

  setIndexTabs(): void {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].index = i;
    }
  }

  addTab() {
    this.tabs.push({ unit_measurement_id: 0, name: '', brand: '', model: '', invoice: '', total_quantity: 0, labels_to_inspecc: 0, tariff_fraction: '' });
    this.setIndexTabs();
    this.selectedIndex = this.tabs.length-1;
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.setIndexTabs();
    this.requestService.setProducts( this.tabs );
  }

  changeIndex(value: number): void {
    this.selectedIndex += value;
  }

  goBack(): void {
    this.requestService.productsRequestData = this.tabs
    this.requestService.setOption(0);
  }

  handlerSendProducts(content: [boolean, Product]): void {
    if(content[0]) {
      // this.tabs[content[1].index!].brand = content[1].brand;
      // this.tabs[content[1].index!].invoice = content[1].invoice;
      // this.tabs[content[1].index!].labels_to_inspecc = content[1].labels_to_inspecc;
      // this.tabs[content[1].index!].model = content[1].model;
      // this.tabs[content[1].index!].name = content[1].name;
      // this.tabs[content[1].index!].tariff_fraction = content[1].tariff_fraction;
      // this.tabs[content[1].index!].total_quantity = content[1].total_quantity;
      // this.tabs[content[1].index!].unit_measurement_id = content[1].unit_measurement_id;

      const { index, ...updatedProduct } = content[1];
      const tabToUpdate = this.tabs[index!];
      if (tabToUpdate) {
        Object.assign(tabToUpdate, updatedProduct);
      }

    }

    this.tabs[content[1].index!].isReady = content[0];
    this.requestService.setProducts( this.tabs );

  }

  saveRequest(): void{
    const everyReady: boolean = this.tabs.every((p:Product) => p.isReady === true);
    if( !everyReady ) {
      this.toastService.showSnackbar(false, 'Hay información faltante de algunos productos', 3000)
      return;
    }


    console.log('data request', this.requestService.formRequestData);
    console.log('data products', this.tabs);


  }

}
