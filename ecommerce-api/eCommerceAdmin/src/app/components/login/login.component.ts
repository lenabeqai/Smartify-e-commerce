import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  FailedLogin:boolean = false;

   errorMsg:string ='';

  loginForm = new FormGroup({
    Email: new FormControl('',{

    validators:[Validators.required]

    }),
    Password: new FormControl('',{

      validators:[Validators.required]
  
      }),
  });

  constructor(private UserService:UserService, private router:Router){}


  login(){

    if (this.loginForm.invalid)
      {
          this.loginForm.markAllAsTouched();
          return;
      }
      else
      {

    const { Email, Password } = this.loginForm.value;

    this.UserService.login(Email!, Password!).subscribe({
      next:(data) =>{
        console.log("success", data)
        this.FailedLogin = false
         this.router.navigate(['/dashboard'])
      },

      error:(error) => {
        
       this.FailedLogin = true

        console.log("Error"+error)
      }
    })
  }
  }

}
