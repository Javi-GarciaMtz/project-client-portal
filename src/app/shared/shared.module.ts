import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error-404-page/error-404-page.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';



@NgModule({
  declarations: [
    HomePageComponent,
    Error404PageComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule
  ]
})
export class SharedModule { }
