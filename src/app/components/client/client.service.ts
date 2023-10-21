import { Injectable } from '@angular/core';
import { CLIENTS } from './clients.json';
import { Client } from './client';
import { Observable, map, throwError } from 'rxjs';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../user/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private endpoint: string = "http://localhost:8080/api/clients";
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }
  //I commented this because the implementation of an interceptor
  // private addAuthorization() {
  //   let token = this.authService.token;
  //   if (token != null) {
  //     return this.httpHeaders.append('Authorization', 'Bearer ' + token)
  //   }
  //   return this.httpHeaders;
  // }

  // private isNoAuthorized(e: any): boolean {
  //   if (e.status == 401) {
  //     if(this.authService.isAuthenticated()){
  //       this.authService.logout();
  //     }
  //     this.router.navigate(['/login']);
  //     return true;
  //   }
  //   if (e.status == 403) {
  //     Swal.fire({ icon: 'warning', title: 'Not Authorizared', text: `Hi ${this.authService.user.username}, you don´t have the necessary privileges` });
  //     this.router.navigate(['/clients']);
  //     return true;
  //   }
  //   return false;
  // }
  getClients(page: Number): Observable<any> {
    return this.http.get<any>(this.endpoint + '/page/' + page);
  }
  create(client: Client): Observable<any> {
    return this.http.post<any>(this.endpoint, client, { headers: this.httpHeaders });
    /*.pipe(
      catchError(e => {
        if (this.isNoAuthorized(e)) {
          return throwError(() => Error(e));
        }
        if (e.status == 400) {
          return throwError(() => (e.error.Errors));
        }
        console.log(e);
        Swal.fire('Error', `${e.error.message}`, 'error');
        return throwError(() => new Error(e.error.message));
      })
    );*/
  }
  getClient(id: Number): Observable<Client> {
    return this.http.get<Client>(`${this.endpoint}/${id}` /*, { headers: this.addAuthorization() }*/).pipe(
      catchError(e => {
        /* if (this.isNoAuthorized(e)) {
          return throwError(() => Error(e));
        }*/
        if(e.status != 401 && e.error.message){
          this.router.navigate(['/clients']);
          console.error(e.error.message)
        }        
        return throwError(() => new Error(e));
      })
    );
  }
  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.endpoint}/regions`/*, { headers: this.addAuthorization() }*/);
    /*.pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(() => new Error(e));
      })
    );*/
  }
  updateClient(id: Number, client: Client): Observable<Client> {
    return this.http.put(`${this.endpoint}/${id}`, client /*, { headers: this.addAuthorization() }*/).pipe(
      map((response: any) => response.client as Client),
      catchError(e => {
        /*if (this.isNoAuthorized(e)) {
          return throwError(() => Error(e));
        }*/
        if (e.status == 400) {
          return throwError(() => new Error(e));
        }
        if(e.error.message){
          console.error(e.error.message);
        }        
        return throwError(() => new Error(e));
      })
    );
  }

  deleteClient(id: Number): Observable<Client> {

    return this.http.delete<Client>(`${this.endpoint}/${id}`/*,{ headers: this.addAuthorization() }*/).pipe(
      catchError(e => {
        /*
        if (this.isNoAuthorized(e)) {
          return throwError(() => Error(e));
        }*/
        if(e.error.message){
          console.error(e.error.message);
        }                
        return throwError(() => new Error(e));
      })
    );
  }

  // uploadPhoto(file:File, id:number):Observable<Client>{
  //   let formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('id', id.toString());    
  //   return this.http.post(`${this.endpoint}/upload`, formData).pipe(
  //     map( (response:any)=> response.client as Client),
  //     catchError(e =>{                
  //       Swal.fire('Error', `${e.error.message}`, 'error');
  //       return throwError(() => new Error(e.error.message));
  //     })
  //   );
  // }

  uploadPhoto(file: File, id: number): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token)
    }

    const req = new HttpRequest('POST', `${this.endpoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req)
    /*.pipe(
      catchError(e => {
        this.isNoAuthorized(e);
        return throwError(() => new Error(e));
      })
    );*/
  }



}
