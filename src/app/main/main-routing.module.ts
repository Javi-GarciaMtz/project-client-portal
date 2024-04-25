import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { noSessionGuard } from '../shared/guards/no-session/no-session.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [noSessionGuard],
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
  exports: [RouterModule],
  providers: [noSessionGuard]
})
export class MainRoutingModule { }
