import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { RequestService } from '../../services/request/request.service';
import { Product } from '../../interfaces/product.interface';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar-products',
  templateUrl: './search-bar-products.component.html',
  styleUrl: './search-bar-products.component.scss'
})
export class SearchBarProductsComponent implements OnInit, OnDestroy {

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;

  private arrSubs: Subscription[] = [];

  public filteredProducts!: Observable<Product[]>;
  public products: Product[] = [];

  public controlAutocomplete = new FormControl();

  constructor(
    private requestService: RequestService,
  ) {}

  ngOnInit() {

    this.filteredProducts = this.controlAutocomplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.products = this.requestService.products;
    this.arrSubs.push(
      this.requestService.getProducts.subscribe({
        next: (p:Product[]) => {
          this.products = p;
          this.controlAutocomplete.setValue(null);
          this.handlerNewProducts();
        }
      })
    );

  }

  ngOnDestroy(): void {
    this.arrSubs.forEach((s:Subscription) => s.unsubscribe());
  }

  _filter(value: any): Product[] {
    let filterValue = '';
    if( typeof(value) === 'string' ) {
      filterValue = value.toLowerCase();
    } else {
      if( value[1] === 'name' ) {
        filterValue = value[0].name.toLowerCase();

      } else {
        filterValue = value[0].invoice.toLowerCase();

      }
    }

    return this.products.filter((product: Product) =>
      (product.name.toLowerCase().includes(filterValue) ||
      product.invoice.toLowerCase().includes(filterValue)) && product.isReady
    );
  }

  onOptionSelected(e:MatAutocompleteSelectedEvent): void {
    if( !e.option.value ) return;

    this.requestService.setIndex(e.option.value[0].index);


    if( e.option.value[1] === 'name' ) {
      this.controlAutocomplete.setValue( e.option.value[0].name );
    } else {
      this.controlAutocomplete.setValue( e.option.value[0].invoice )
    }
  }

  handlerNewProducts() {
    for (let i = 0; i < this.products.length; i++) {
      this.products[i].index = i;
    }
  }

}
