import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PanelAdminContainerComponent } from './pages/panel-admin-container/panel-admin-container.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PanelAdminContainerComponent,
    CreateUserComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
