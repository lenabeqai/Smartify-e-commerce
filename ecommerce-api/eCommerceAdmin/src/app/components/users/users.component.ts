import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule, NgFor } from '@angular/common';
import { AdduserComponent } from '../adduser/adduser.component';
import { user } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-users',
  standalone:true,
  imports:[CommonModule,AdduserComponent,HeaderComponent],
  providers:[ToastrService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isNew!:boolean;

  currentPage = 1;
  itemsPerPage = 6;
  paginatedUsers: any[] = [];
  totalPages: number = 0;

  openconfirmbox:boolean = false;
  selectedid:number=0;

   isNewuser:boolean = false;
   isUpdateuser:boolean = false;
   
    selectedUser!:user;
    userID!:number;

    newUser:user = {
      Email : "",
      Username : "",
      Password : '',
      Role : '',
      isActive:true
    };
    
   onCancel(){
    this.isNewuser = false;
    this.isUpdateuser = false;
   }

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getUsers();  

  }

  onSave(){

    this.isNewuser = false
    this.isUpdateuser = false

    this.userService.updateUser(this.userID,this.selectedUser).subscribe({
      next:()=>{
        this.getUsers()
      this.updatePaginatedUsers()
      this.toastr.success(
        'User updated successfully!', 'Success', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      },

      error:(error)=>
        console.log("error :", error),
      
    })
  }

  updatePaginatedUsers() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);

  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  opendialog(){
    this.isNewuser = true;
    this.isNew = true
  }
  getPaginationArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next:(data) => {
        this.users = data,
   this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.updatePaginatedUsers();
      },
      error:(error) => 
        console.error('Error fetching users:', error)
      
  });
  }

  deleteUser(id: number): void {

    this.openconfirmbox = true
    this.selectedid = id;
    /*const confirmed = confirm('Are you sure you want to delete this user?');

    if(confirmed){
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.UserID !== id)
        this.updatePaginatedUsers();
        this.toastr.success(
          'User deleted successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
      },
      error:(error) => {
        console.error('Error deleting user:', error),
      this.toastr.error(
        'Failed to delete the user.', 'Error', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      }
      });
    
    }
      */
  }

onCancelConfirm(){
  this.openconfirmbox = false
}
  onComfirmdelete(){
    this.userService.deleteUser(this.selectedid).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.UserID !== this.selectedid)
        this.updatePaginatedUsers();
        this.toastr.success(
          'User deleted successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.openconfirmbox = false
      },
      error:(error) => {
        console.error('Error deleting user:', error),
      this.toastr.error(
        'Failed to delete the user.', 'Error', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      }
  });
}


  onEdit(id:number,user:user){

    this.selectedUser = user
    this.isUpdateuser = true
    this.isNew = false
    this.userID = id
    

  }

  onDisplay(id:Number){
    
  }

  toggleStatus(id:number, user:user){

    user.isActive = !user.isActive
    
    this.userService.updateUser(id,user).subscribe({
       
      next:() =>
        this.toastr.success('status changed successfully','success'),

     error:(error) =>
     {
      this.toastr.error(' failed to change status','error')
      console.log("statuschange: ", error)
     }
    });

  }

}
