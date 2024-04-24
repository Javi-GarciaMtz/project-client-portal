import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { RequestRoutingModule } from './request/request-routing.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { UsersRoutingModule } from './users/users-routing.module';
import { SessionCheckGuard } from './shared/guards/session/session-check.guard';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    RequestRoutingModule,
    AdminRoutingModule,
    AuthRoutingModule,
    UsersRoutingModule,
    SharedModule,
  ],
  providers: [
    SessionCheckGuard,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
