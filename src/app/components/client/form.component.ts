import { Component, OnInit } from '@angular/core';
import { Client } from './client';
import { ClientService } from './client.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public title: String = 'Create client';
  public client: Client = new Client();
  public errors: String[] = [];
  public regions: Region[] = [];

  constructor(private clientService: ClientService, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.getClient();
    this.getRegions();
  }
  public getClient(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if (id) {
          this.clientService.getClient(id).subscribe(
            value => this.client = value
          )
        }
      }
    )
  }
  public getRegions() {
    this.clientService.getRegions().subscribe({
      next: (regions) => {        
        this.regions = regions;
      }
    });
  }
  public update(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if (id) {
          this.clientService.updateClient(id, this.client).subscribe(
            {
              next: (response) => {
                this.router.navigate(['/clients'])
                Swal.fire('Update', `Client ${response.name}  updated successfully`, 'success')
              },
              error: (error) => {
                this.errors = error.error.errors as string[];
                console.error(error.status);
                console.error(error.error.errors);

              },
              complete: () => console.info('complete')
            }
          )
        }
      }
    )
  }
  public delete(): void {
    this.activatedRoute.params.subscribe(
      params => {
        if (params['id']) {
          this.clientService.deleteClient(params['id']).subscribe(
            response => {
              Swal.fire('Delete', `Client ${this.client.name} deleted successfully`, 'success')
            }
          )
        }
      }
    )
  }
  public create() {
    this.clientService.create(this.client).subscribe(
      {
        next: (response) => {
          this.router.navigate(['/clients'])
          Swal.fire('Create', `Client ${response.client.name} created successfully`, 'success')
        },
        // error: (error) => console.error(error),
        error: (error) => {
          this.errors = error as string[];
          console.error(error);
        },
        complete: () => console.info('complete')
      }
    )
  }
  public compareRegion(o1: Region, o2: Region):boolean {
    if(o1 === undefined  && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null ? false : o1.idRegion === o2.idRegion;
  }
}
