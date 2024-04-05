import { Component } from '@angular/core';
import { sidebarItems } from '../../../data/data';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  readonly sidebarItems = sidebarItems;

}
