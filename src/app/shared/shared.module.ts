import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error-404-page/error-404-page.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SearchBarRequestsComponent } from './components/search-bar-requests/search-bar-requests.component';
import { TableRequestsComponent } from './components/table-requests/table-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowErrorsInFormComponent } from './components/show-errors-in-form/show-errors-in-form.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';



@NgModule({
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    SearchBarRequestsComponent,
    TableRequestsComponent,
    ShowErrorsInFormComponent,
    LoadingOverlayComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    SearchBarRequestsComponent,
    TableRequestsComponent,
    ShowErrorsInFormComponent,
    LoadingOverlayComponent,
  ]
})
export class SharedModule { }
