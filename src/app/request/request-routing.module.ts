import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestContainerComponent } from './pages/request-container/request-container.component';

const routes: Routes = [
  { path: 'create', component: RequestContainerComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
