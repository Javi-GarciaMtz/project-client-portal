import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ls_user_session } from '../../../environments/environments';

@Injectable()
export class noSessionGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.isLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // Redirigir a la página de inicio de sesión si no hay sesión
      return false;
    }
  }

  isLoggedIn(): boolean {
    // Verificar si existe una sesión en el localStorage
    const session = localStorage.getItem( ls_user_session );
    return !!session; // Si existe una sesión, retorna true, de lo contrario false
  }
}
