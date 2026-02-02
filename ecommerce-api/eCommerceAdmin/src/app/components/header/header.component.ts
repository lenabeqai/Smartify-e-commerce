import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() title!:string;

  constructor(private userService:UserService, private router:Router){}

  
    getLoggedInUserName(): string {
      return localStorage.getItem('username') || 'Guest';
    }
  
 
}
