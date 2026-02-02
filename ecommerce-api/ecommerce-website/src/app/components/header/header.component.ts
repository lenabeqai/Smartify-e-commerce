import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../guards/auth.service';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { count } from 'console';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

   categories: any[] = [];
 cartCount = 0;

   user:any = null;
    showDropdown = false;
    cartcount = 0;

  constructor(private productServices: ProductService, private categoryServices: CategoryService,private router:Router, private authservice:AuthService, private cartservices:CartService){

  }
  
   ngOnInit(){

    this.cartservices.cartCount$.subscribe(count =>{

      this.cartCount = count
     })


   this.categoryServices.getcategories().subscribe ({
      next:(data) => {
            this.categories = data;
            console.log("categories:",data);
           // this.isLoading = false;
      },

      error: (err) => {
        console.error('Error fetching categories:', err);
        //this.isLoading = false;
      },
    })

    this.authservice.user$.subscribe(u => {
      this.user = u;
      console.log("fromheader",u);
   })
  
  }

  

   toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authservice.logout();
    this.router.navigate(['/home']);
  }

   goToCart() {
    this.router.navigate(['/cart']);
  }

}
