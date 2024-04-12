import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '../shared/pages/home-page/home-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // { path: '', component: HomePageComponent },
      { path: '', redirectTo: 'request/create', pathMatch: 'full' },
      { path: 'request', loadChildren: () => import('./../request/request.module').then(m => m.RequestModule) },
      { path: 'admin', loadChildren: () => import('./../admin/admin.module').then(m => m.AdminModule) },
      { path: 'users', loadChildren: () => import('./../users/users.module').then(m => m.UsersModule) },
    ]
  },
  { path: 'auth', loadChildren: () => import('./../auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
