import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-serch-bar-products',
  templateUrl: './serch-bar-products.component.html',
  styleUrl: './serch-bar-products.component.scss'
})
export class SerchBarProductsComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = [
    'Escalera 10m',
    '01000289',
    'Pantalon A',
    '112122',
    'Otro producto'
  ];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
