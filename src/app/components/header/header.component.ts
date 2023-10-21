import { Component } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
//export is a modifier
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {

  }
  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'success',
      title: 'Log out',
      text: `The log out was successful!`
    });
    this.router.navigate(['/login']);
  }
}
