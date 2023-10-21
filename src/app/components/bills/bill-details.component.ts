import { Component, OnInit } from '@angular/core';
import { BillService } from './services/bill.service';
import { ActivatedRoute } from '@angular/router';
import { Bill } from './models/bill';
@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
})
export class BillDetailsComponent implements OnInit {
  public bill!:Bill;
  public title:String = 'Bill';
  constructor(private billService:BillService, private activatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let id = +params.get('id')!;
      this.billService.getBill(id).subscribe({
        next:(e)=>{
          this.bill = e;
        }
      })
    })
  }  
}
