import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    if (inject(AuthService).isTokenValid()) {
      return true;
    }
    Swal.fire({ icon: 'info', title: 'Session Expired', text: `Hi ${inject(AuthService).user.username}, your session has expired`});
    inject(AuthService).logout();
    inject(Router).navigate(['/login']);
    return false
  }
  inject(Router).navigate(['/login']);
  return false;
};
