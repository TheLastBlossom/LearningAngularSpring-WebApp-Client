import { Component, OnInit } from '@angular/core';
import { Bill } from './models/bill';
import { ClientService } from '../client/client.service';
import { ActivatedRoute } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe} from '@angular/common';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  // standalone: true,
  // imports: [
  //   FormsModule,
  //   // MatFormFieldModule,
  //   // MatInputModule,
  //   // MatAutocompleteModule,
  //   // ReactiveFormsModule,
  //   // NgFor,
  //   // AsyncPipe,
  // ],
})
export class BillsComponent implements OnInit{
  public title:string = 'New bill';
  public bill:Bill = new Bill();
  constructor(private clientService:ClientService, private activatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clientId = +params.get('clientId')!;
      this.clientService.getClient(clientId).subscribe({
        next: (e)=>{
          this.bill.client = e;
        }
      })
    });
  }
}
