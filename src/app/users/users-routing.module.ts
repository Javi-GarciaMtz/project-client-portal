import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRequestsContainerComponent } from './pages/my-requests-container/my-requests-container.component';

const routes: Routes = [
  { path: 'my-requests', component: MyRequestsContainerComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
