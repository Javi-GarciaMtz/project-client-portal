import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRequestsContainerComponent } from './pages/my-requests-container/my-requests-container.component';
import { PrivacyNoticeComponent } from '../shared/components/privacy-notice/privacy-notice.component';

const routes: Routes = [
  { path: 'my-requests', component: MyRequestsContainerComponent },
  { path: 'privacy-notice', component: PrivacyNoticeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
