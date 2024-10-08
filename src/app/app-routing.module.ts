import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error-404-page/error-404-page.component';
import { versionSystemGuard } from './shared/guards/versiom-system/version-system.guard';


const routes: Routes = [
  { canActivate: [versionSystemGuard], path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { canActivate: [versionSystemGuard], path: '404-not-found', component: Error404PageComponent },
  { path: '**', redirectTo: '404-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
