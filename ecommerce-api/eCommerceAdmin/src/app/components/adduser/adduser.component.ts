import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { user } from '../../models/user.model';
import {FormsModule} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent implements OnInit{
 username:string = ''
 email:string=''
 password:string = ''
 role:string = ''

  @Input() user!:user
  
  @Input() isNew!:boolean;

  @Output() cancel = new EventEmitter<void>()

  @Output() save = new EventEmitter<void>()

  title:string =  ''
  btncaption:string = ''
  
  roles = ['admin','customer'];

  constructor(private UserService:UserService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.title = this.isNew ? "Register user" : "Update user"
    this.btncaption = this.isNew ? "Register" : "Update"
  }

  onSubmit()
  {
    if(this.isNew)
    {
      this.UserService.createUser(this.user).subscribe({
        next:()=>{
          console.log("added successfully"),
          this.toastr.success(
            'User added successfully!', 'Success', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
        },
        error:(error)=>{
          console.log("error :", error),
        console.log("oncreate",this.user)
        this.toastr.error(
          'Failed to create the user.', 'Error', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
        }
      })

  }

      this.save.emit()
  }

  onCancel(){
    this.cancel.emit()
  }

}
