import { Component } from '@angular/core';
import { RequestService } from '../../services/request/request.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss'
})
export class AddProductsComponent {

  public tabs: boolean[] = [true, true, true];
  public selectedIndex: number = 0;

  constructor(
    private _requestService: RequestService,
  ) {}

  addTab() {
    this.tabs.push(true);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  changeIndex(value: number): void {
    this.selectedIndex += value;
  }

  goBack(): void {
    this._requestService.setOption(0);
  }

}
