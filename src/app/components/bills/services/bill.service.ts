import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../user/auth.service';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private endpoint: string = "http://localhost:8080/api/bills";
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor( private http: HttpClient,    
    private authService: AuthService) {}
    getBill(id:number): Observable<Bill>{
      return this.http.get<Bill>(`${this.endpoint}/${id}`)
    }
    delete(id:number):Observable<void>{
      return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}
