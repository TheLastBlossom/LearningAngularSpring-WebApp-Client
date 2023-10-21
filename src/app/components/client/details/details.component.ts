import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../client';
import { ClientService } from '../client.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../user/auth.service';
import { BillService } from '../../bills/services/bill.service';
import { Bill } from '../../bills/models/bill';

@Component({
  selector: 'details-client',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  @Input() client!: Client;
  title: String = 'Details client';
  private selectedPhoto?: File;
  progress: number = 0;
  constructor(private clientService: ClientService, private modalService: ModalService, public authService: AuthService, private billService:BillService) { }
  // ngOnInit(): void {
  //   this.activatedRoute.paramMap.subscribe(params => {
  //     let id: number = parseInt(params.get('id')!);
  //     if (id) {
  //       this.clientService.getClient(id).subscribe(client =>{
  //         this.client = client;
  //       });
  //     }

  //   })
  // }
  selectPhoto(event: any) {
    this.selectedPhoto = event.target.files[0];
    this.progress = 0;
    if (this.selectedPhoto!.type.indexOf('image') < 0) {
      Swal.fire('Error', 'The file must be of type image', 'error');
      this.selectedPhoto = undefined;
    }
  }
  uploadPhoto() {
    this.clientService.uploadPhoto(this.selectedPhoto!, this.client.id).subscribe({
      next: (event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        } else if (event.type == HttpEventType.Response) {
          let response: any = event.body;
          this.client = response.client as Client;
          this.modalService.notifyUpload.emit(this.client);
          Swal.fire('Uploaded!', `The ${this.client.name}'s photo was uploaded sucessfully`, 'success')
        }
      }
    })
  }
  closeModal() {
    this.modalService.closeModal();
    this.selectedPhoto = undefined;
    this.progress = 0;
  }

  getModalStatus(): boolean{
    return this.modalService.modal;
  }   
  deleteBill(bill:Bill){
    Swal.fire({
      title: `Are you sure you want to delete the bill ${bill.description}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.billService.delete(bill.id).subscribe(
          response => {
            this.client.bills = this.client.bills.filter(b => b !==bill)
            Swal.fire('Deleted!', `The bill ${bill.description} was deleted successfully`, 'success')
          })
      }
    })
  }
}
