import { Component, OnInit } from '@angular/core';
import { ClientService } from './client.service';
import { Client } from './client';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ModalService } from './details/modal.service';
import { AuthService } from '../user/auth.service';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients!: Client[];
  page:number = 0;
  paginator:any;
  selectedClient!:Client;
  constructor(private clientService: ClientService, private router: Router, private activatedRoute: ActivatedRoute, private modalService:ModalService, public authService: AuthService) { }
  ngOnInit(): void { 
    this.activatedRoute.paramMap.subscribe(
      (params =>{
        this.page =  params.get('page') !=null ? parseInt(params.get('page')!) :1 ;        
        this.loadClients(this.page -1);
      })
    )   
  }
  public delete(client: Client): void {
    Swal.fire({
      title: `Are you sure you want to delete the client ${client.name}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(client.id).subscribe(
          response => {
            this.loadClients(this.page);
            Swal.fire('Deleted!', `Client ${client.name} deleted successfully`, 'success')
          })
      }
    })
  }
  loadClients(page:Number) {
    this.clientService.getClients(page).pipe(
      // here you can assign this.clients = clients too
      //subscribe only executes the observable
      tap((response: any) => {
        console.log(response);
        (response.content as Client[]).map(
          (client) => {
            client.name = client.name.toUpperCase();            
            return client;
          }
        )
      })
    )
      .subscribe(
        (response) => {
          this.paginator = response;
          (response.content as Client[]).map(
            client => {
              // client.name = client.name.toUpperCase();
              let datePipe = new DatePipe('en-US');
              // client.createAt = datePipe.transform(client.createAt, "dd/MM/yyyy");
              // client.createAt = formatDate(client.createAt, "dd-MM/yyyy", "en-US");        
              // client.createAt = formatDate(client.createAt, "EEEE dd-MMM/yyyy", "es");        
              return client;
            }
          )
          return this.clients = response.content;        
        }
      );
      this.modalService.notifyUpload.subscribe({
        next: (newClient:Client)=>{
          this.clients = this.clients.map(originalClient=>{
            if(newClient.id == originalClient.id){
              originalClient.photo = newClient.photo;
            }
            return originalClient;
          });
        }
      })
  }

  openModal(client:Client){
    this.selectedClient = client;
    this.modalService.openModal();
  }
}
