import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { MyRequestsContainerComponent } from './pages/my-requests-container/my-requests-container.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MyRequestsContainerComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ]
})
export class UsersModule { }
