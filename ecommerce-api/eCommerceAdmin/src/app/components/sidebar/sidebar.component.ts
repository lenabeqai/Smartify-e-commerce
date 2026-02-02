import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

viewmenu:boolean = true

  ngOnInit(){
    console.log("jkjbk", localStorage.getItem('token'))
    
    if (localStorage.getItem('token') == null)
    {
         this.viewmenu = false
    }
    
  }
    
    currentRoute!: string;

  constructor(private router: Router, private userService:UserService) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  Logout(){

    this.userService.logout()
    this.router.navigate(['/login'])
 }

}
