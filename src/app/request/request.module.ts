import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { RequestRoutingModule } from './request-routing.module';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { RequestContainerComponent } from './pages/request-container/request-container.component';
import { SerchBarProductsComponent } from './components/serch-bar-products/serch-bar-products.component';
import { AddProductContainerComponent } from './pages/add-product-container/add-product-container.component';



@NgModule({
  declarations: [
    CreateRequestComponent,
    AddProductsComponent,
    RequestContainerComponent,
    SerchBarProductsComponent,
    AddProductContainerComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    AngularMaterialModule,
  ]
})
export class RequestModule { }
