import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnChanges, OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.from = Math.min(Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);//1
    this.to = Math.max(Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);//7
    if (this.paginator.totalPages > 5) {  
      this.pages = new Array(this.to - this.from + 1).fill(0).map(
        (value, index) => {
          return index + this.from;
        })
    } else {
      this.pages = new Array(this.paginator.totalPages).fill(0).map(
        (value, index) => {
          return index + 1;
        }
      )
    }
  }
  @Input() paginator: any;
  pages: number[] = [];
  from: number = 0;
  to: number = 0;
}
