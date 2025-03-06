import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

const AUTH_TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
