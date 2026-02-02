import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { RouterLink,Router,RouterModule } from '@angular/router';
import { CurrencyPipe, NgIf, TitleCasePipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../guards/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe,TitleCasePipe,NgIf,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product!:Product;

   constructor(private Cartservices:CartService, private authservice: AuthService, private snackBar: MatSnackBar){}
  NoImage = 'data:image/jpeg;base64,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'
  
  AddToCart(){

        if(this.authservice.isLoggedIn())
    {
       this.Cartservices.addToCart(this.product);
       
       
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
