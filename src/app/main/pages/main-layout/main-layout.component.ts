import { Component } from '@angular/core';
import { sidebarItems } from '../../../data/data';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { User } from '../../../auth/interfaces/user.interface';
import { LoadingOverlayService } from '../../../shared/services/loading-overlay/loading-overlay.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  readonly sidebarItems = sidebarItems;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private loadingOverlayService: LoadingOverlayService,
  ) {}

  logout(): void {
    this.loadingOverlayService.addLoading();

    setTimeout(() => {
      this.storageService.clearDataUser();
      this.loadingOverlayService.removeLoading();
      this.router.navigate(['/auth/login']);
    }, 1500);

  }

  checkPermissions(permissions: string[]): boolean {
    const dataUser: User = this.storageService.retrieveAndDecryptUser();

    return permissions.includes( dataUser.user.role );

  }

}
