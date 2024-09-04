import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CreateRequestComponent } from './components/create-request/create-request.component';
import { RequestRoutingModule } from './request-routing.module';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { RequestContainerComponent } from './pages/request-container/request-container.component';
import { AddProductContainerComponent } from './pages/add-product-container/add-product-container.component';
import { SearchBarProductsComponent } from './components/search-bar-products/search-bar-products.component';
import { FormsModule } from '@angular/forms';
import { ProductTabComponent } from './components/product-tab/product-tab.component';
import { SharedModule } from '../shared/shared.module';
import { ModifyRequestComponent } from './components/modify-request/modify-request.component';
import { ModifyProductsComponent } from './components/modify-products/modify-products.component';
import { DeleteRequestComponent } from './components/delete-request/delete-request.component';
import { TabsModifyComponent } from './components/tabs-modify/tabs-modify.component';



@NgModule({
  declarations: [
    CreateRequestComponent,
    AddProductsComponent,
    RequestContainerComponent,
    AddProductContainerComponent,
    SearchBarProductsComponent,
    ProductTabComponent,
    ModifyRequestComponent,
    ModifyProductsComponent,
    DeleteRequestComponent,
    TabsModifyComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    AngularMaterialModule,
    FormsModule,
    SharedModule,
  ]
})
export class RequestModule { }
