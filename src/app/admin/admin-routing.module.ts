import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelAdminContainerComponent } from './pages/panel-admin-container/panel-admin-container.component';

const routes: Routes = [
  { path: 'manage', component: PanelAdminContainerComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
