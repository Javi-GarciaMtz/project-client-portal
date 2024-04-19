// import { CanActivateFn } from '@angular/router';

// export const sessionCheckGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class SessionCheckGuard implements CanActivate {

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
    const session = localStorage.getItem('session');
    return !!session; // Si existe una sesión, retorna true, de lo contrario false
  }
}
