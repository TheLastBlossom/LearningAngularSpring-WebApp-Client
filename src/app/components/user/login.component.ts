import { Component, OnInit } from '@angular/core';
import { User } from './user';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title: String = "Please, sign in!";
  user: User;
  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Sign In',
        text: `Hello ${this.authService.user.name}, your are already authenticated!`
      });
      this.router.navigate(['/clients']);
    }
  }
  login(): void {
    if (this.user.username == null || this.user.password == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'The username or password seems to be empty'
      });
      return;
    }
    this.authService.login(this.user).subscribe({
      next: (response: any) => {
        if (response.jwtToken != null) {
          this.authService.saveUser(response.jwtToken);
          this.authService.saveToken(response.jwtToken);
          this.router.navigate(['/clients']);
          Swal.fire({
            icon: 'success',
            title: 'The login was a sucess',
            text: `Welcome ${this.authService.user.name}`
          });
        }
      },
      error: (err: any) => {
        if (err.status == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Incorrect credential',
            text: 'The username or password is incorrect'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Unknown Error',
            text: 'Please, try again later'
          });
        }
      }
    })
  }
}
