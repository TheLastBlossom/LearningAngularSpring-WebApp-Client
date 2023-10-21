import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from './user';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlEndPoint: string = "http://localhost:8080/api/authenticate";
  private credentials = btoa('angularapp' + ':' + '1234');
  private _user: User | null;
  private _token: string | null;
  constructor(private http: HttpClient) {
    this._user = null;
    this._token = null;
  }
  public get user(): User {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('user') != null) {
      this._user = JSON.parse(sessionStorage.getItem('user')!) as User;
      return this._user;
    }
    return new User();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      return sessionStorage.getItem('token')!;
    }
    return '';
  }


  // private httpHeaders = new HttpHeaders({
  //   // 'Content-Type': 'application/x-www-form-urlencoded',
  //   'Content-Type':  'application/json'
  //   // 'Authorization': 'Basic ' + this.credentials
  // });

  login(user: User): Observable<any> {
    // let params = new URLSearchParams();
    // params.set('grant_type', 'password');
    // params.set('username', user.username);
    // params.set('password', user.password);
    // return this.http.post<any>(this.urlEndPoint, params, { headers: this.httpHeaders })

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const authenticationReq = new Authencation(user.username, user.password);
    return this.http.post<any>(this.urlEndPoint, authenticationReq, httpOptions);
  }
  saveUser(accessToken: string): void {
    this._user = new User();
    let payload = this.decodeAccessToken(accessToken);
    let userdata = this.extractUserData(payload);
    this._user.name = userdata.name;
    this._user.surname = userdata.surname;
    this._user.username = userdata.username;
    this._user.email = userdata.email;
    this._user.rols = payload.rols;
    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }
  decodeAccessToken(accessToken: string): any {
    if (accessToken != null) {
      let payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload;
    }
    return null;
  }
  extractUserData(payload: any): any {
    if (payload != null) {
      let userdata = JSON.parse(payload.user);
      return userdata;
    }
    return null;
  }
  isAuthenticated(): boolean {
    let payload;
    try {
      payload = this.decodeAccessToken(this.token);
    } catch (e) {
      payload = null;
    }
    if (payload != null) {
      let userdata = this.extractUserData(payload);
      return (userdata.username.length > 0) ? true : false;
    } else {
      return false;
    }
  }
  isTokenValid(): boolean {
    let payload;
    try {
      payload = this.decodeAccessToken(this.token);
    } catch (e) {
      payload = null;
    }
    if (payload != null) {
      let now = new Date().getTime() / 1000;
      if (payload.exp < now) { return false; } return true;
    }
    return false
  }
  logout() {
    this._token = null;
    this._user = null;
    sessionStorage.clear();
  }
  hasRole(role: string): boolean {
    if (this.user.rols.includes(role)) {
      return true;
    }
    return false;
  }
}
class Authencation {
  user: string;
  password: string;
  constructor(user: string, password: string) {
    this.user = user;
    this.password = password;
  }

}
