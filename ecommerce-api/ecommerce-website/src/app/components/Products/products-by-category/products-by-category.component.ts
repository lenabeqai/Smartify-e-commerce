import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { CommonModule, CurrencyPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { matFormFieldAnimations } from '@angular/material/form-field';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [NgFor,ProductCardComponent,NgIf,CurrencyPipe,FormsModule,TitleCasePipe,RouterModule,ProductCardComponent],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.css'
})
export class ProductsByCategoryComponent {
categoryName!:string;
CategoryId!:number;
products!:Product[];
  isLoading = true;

  sortOption = 'default';

  constructor(private route: ActivatedRoute, private productservices:ProductService, private router:Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.CategoryId = Number(params.get('Id'))!;
      this.categoryName = params.get('name')!;
      // 🔁 Re-fetch products for this category
      console.log('Category changed:', this.categoryName);
      this.loadProductsByCategory(this.CategoryId);
    });

    

    

  }

  loadProductsByCategory(Id: number) {
    this.isLoading = true;
       this.productservices.getProductsByCategoryId(Id).subscribe({
      next:(data) => {
        console.log("data",data)
        this.products = data;
        this.isLoading = false;


      },
      error:(err) =>{
           console.log("error:",err);
          this.isLoading = false;

      }
    })
  }

  sortProducts() {
    switch (this.sortOption) {
      case 'price-low':
        this.products.sort((a, b) => a.Price - b.Price);
        break;
      case 'price-high':
        this.products.sort((a, b) => b.Price - a.Price);
        break;
      case 'name':
        this.products.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      default:
        this.loadProductsByCategory(this.CategoryId);
    }
  }

setSort(option: string) {
  this.sortOption = option;
  this.sortProducts();
}

}
