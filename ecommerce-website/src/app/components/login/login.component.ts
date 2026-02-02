import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../guards/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';




@Component({
  selector: 'app-login',
  standalone: true,
  encapsulation:ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  registererrmsg: string = ""
  registerfailed = false

submitted = false;
  isLogin = true;
  hidePassword = true;
  user:User = {
    Username:'',
    Email:'',
    Password:'',
    Role:'Customer'
  };

  constructor(private UserServices:UsersService, private authservice:AuthService, private router:Router){}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.user.Username = ''
    this.user.Email = ''
    this.user.Password = ''
    this.registerfailed = false
    this.submitted = false;


    
  }

  submit(form:NgForm) {

    this.submitted = true;
        
        if(form.invalid) return;

    if (this.isLogin)
       {
        
            this.registerfailed = false

          this.authservice.login({Email:this.user.Email,Password:this.user.Password}).subscribe({
         
            next:(response)=>{
                this.authservice.saveToken(response.token);
                this.authservice.saveUser(response);
                this.authservice.isLoggedIn();
                this.router.navigate(['/home']);
            },

            error:(err)=>{
                console.error('Login failed', err);
                this.submitted = false;
            }
          })

       }
    else 
      
      {this.UserServices.RegisterNewUser(this.user).subscribe({
       
        next:(data) =>
        {console.log(data)
          this.isLogin = true
        }
        ,
        error:(eregisterrror)=>
        {
          console.log("registerroor: ",eregisterrror.error)
          this.registererrmsg = "this email already exist"
          this.submitted = false;
            this.registerfailed = true

          // After API call fails
        }
      })}
    console.log(this.user)
    
  }
}


