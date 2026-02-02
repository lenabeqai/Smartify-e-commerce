import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router to handle navigation
  const token = localStorage.getItem('token'); // Check for token in localStorage

  if (token) {
    return true; // Allow access if token exists
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redirect to login
    return false;
  }
};
