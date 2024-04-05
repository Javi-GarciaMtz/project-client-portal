import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { RequestRoutingModule } from './request-routing.module';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { RequestContainerComponent } from './pages/request-container/request-container.component';



@NgModule({
  declarations: [
    CreateRequestComponent,
    AddProductsComponent,
    RequestContainerComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    AngularMaterialModule,
  ]
})
export class RequestModule { }
