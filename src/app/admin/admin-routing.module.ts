import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelAdminContainerComponent } from './pages/panel-admin-container/panel-admin-container.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

const routes: Routes = [
  { path: 'manage', component: PanelAdminContainerComponent },
  { path: 'create-user', component: CreateUserComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
