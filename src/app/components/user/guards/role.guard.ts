import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  // if(!inject(AuthService).isAuthenticated()){
  //   inject(Router).navigate(['/login']);
  //   return false;
  // } 
  let role = route.data['role'] as string;
  if (inject(AuthService).hasRole(role)) {
    return true;
  }
  Swal.fire({ icon: 'warning', title: 'Not Authorizared', text: `Hi ${inject(AuthService).user.username}, you don´t have the necessary privileges` });
  inject(Router).navigate(['/clients']);
  return false;
};
