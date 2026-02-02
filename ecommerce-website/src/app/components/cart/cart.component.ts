import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { threadId } from 'worker_threads';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {

  cartItems:any[] = [];

  constructor(private cartservices:CartService){}

  ngOnInit(){

    this.cartservices.cart$.subscribe( items =>{
      this.cartItems = items;

    })
    //this.cartItems = this.cartservices.getCart();
    console.log("ffss", this.cartItems)
  }

  increase(item: any) {
    item.quantity++;
    this.cartservices.addToCart(item)
    this.cartservices.cart$.subscribe( items =>{
      this.cartItems = this.cartItems;

    })
  }

  decrease(item: any) {
    if (item.quantity > 1) 
      {
        item.quantity--;
  this.cartservices.Removeitem(item)
      }

    else
   {
     item.quantity = 0
     this.cartservices.removeFromCart(item.ProductID)
   this.cartservices.cart$.subscribe( items =>{
      this.cartItems = this.cartItems;

    })

   }
    this.getTotal()
  }

  remove(Id: any) {
        this.cartservices.removeFromCart(Id);
    this.cartservices.cart$.subscribe( items =>{
      this.cartItems = this.cartItems;

    })
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.Price * item.quantity, 0);
  }
}
