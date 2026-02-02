import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../guards/auth.service';
import { CartService } from '../../services/cart.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatIconModule,RouterModule, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

   product : any;

  constructor(private route: ActivatedRoute, private ProductServices:ProductService, private router:Router, private authservice:AuthService, private cartservice: CartService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    this.ProductServices.getProductById(Number(id)).subscribe ({
      
      next:(data) =>{
           this.product = data;
           console.log("product",this.product)
      },

      error:(error) =>
      {
        console.log(Error)
      }

    });
    
  }


    AddToCart(){

    if(this.authservice.isLoggedIn())
    {
       this.cartservice.addToCart(this.product);
       
       
      this.snackBar.open('Item added to cart!', 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition:'bottom'
    });

    }
       else

        this.snackBar.open('login first', 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });

  }
}
