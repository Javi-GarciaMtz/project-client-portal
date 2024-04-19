import { Component } from '@angular/core';
import { sidebarItems } from '../../../data/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  readonly sidebarItems = sidebarItems;

  constructor(
    private router: Router,
  ) {}

  logout(): void {
    console.log('logout...');
    localStorage.removeItem('session');

    this.router.navigate(['/auth/login']);

  }

  checkPermissions(permissions: string[]): boolean {
    const currentUserPermissions = JSON.parse( localStorage.getItem('session')! );
    // const currentUserPermissions = this.authService.getCurrentUserPermissions();
    if (currentUserPermissions && currentUserPermissions.type) {
      return permissions.includes(currentUserPermissions.type);
    }
    return false;
  }

}
