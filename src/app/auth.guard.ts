import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('authToken'); // Check if token exists

    if (token) {
      return true; // Allow access if the token exists
    } else {
      this.router.navigate(['/login']); // Redirect to login if no token is found
      return false; // Block access
    }
  }
}
  