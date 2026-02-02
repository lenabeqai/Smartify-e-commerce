import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eCommerceAdmin';

  showSidebar: boolean = true;

  constructor(private router: Router) {
    // Hide sidebar on specific routes
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      if(localStorage.getItem('token') == null)
      {
        this.showSidebar = false
      }
      else
      {
      this.showSidebar = currentRoute !== '/login'; // Hide sidebar on the login page
      }
    });
    
  }

}
