import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PanelAdminContainerComponent } from './pages/panel-admin-container/panel-admin-container.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TableRequestComponent } from './components/table-request/table-request.component';
import { CreateUserComponent } from './components/create-user/create-user.component';



@NgModule({
  declarations: [
    PanelAdminContainerComponent,
    SearchBarComponent,
    TableRequestComponent,
    CreateUserComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
