import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CategoryService } from '../../services/category.service';
import {MatIconModule} from '@angular/material/icon';

import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ProductCardComponent,MatIconModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  products:Product[] = [];
  
  categories: any[] = [];

  isLoading = true;

   categoryiconMap: Record<string, string> = {
    'Smart Phones': 'smartphone',
    'Phone Cases': 'phonelink', 
    'Smart Watches': 'watch',
  };

  constructor(private productServices: ProductService, private categoryServices: CategoryService, private router:Router){}

 

  ngOnInit(){

    this.productServices.getProducts().subscribe ({
      next:(data) => {
            this.products = data;
            console.log("products:",data);
            this.isLoading = false;
      },

      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      },
    })

    this.categoryServices.getcategories().subscribe({
     
       next:(data) =>{

          this.categories = data;
            this.isLoading = false;

       },

       error:(error) =>{
        console.log(error);
            this.isLoading = false;

       }
    })

  }

   scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
