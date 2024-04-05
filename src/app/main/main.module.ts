import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainRoutingModule } from './main-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidenavComponent,
    TopbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AngularMaterialModule,
  ]
})
export class MainModule { }
