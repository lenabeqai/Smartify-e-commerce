import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupName, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { group } from '@angular/animations';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { user } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HeaderComponent, NgIf, NgFor, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  Users!:any[];
  Products!:any[];
  itemprice:string = '';

  orderForm = new FormGroup({
    UserID: new FormControl('',{

    validators:[Validators.required]

    }),
    OrderStatus: new FormControl('',{

      validators:[Validators.required]
  
      }),
  
     orderItems: new FormArray([]),
  
  });

  constructor(private OrderService: OrderService, private userService: UserService, private productService: ProductService, private toastr:ToastrService, private location:Location){}


  ngOnInit(){
      
     this.userService.getUsers().subscribe({

      next:(data) =>{
        this.Users = data,
        console.log("Users",data)
      },

      error:(error) =>{
        console.log("retreive users failed",error)
      }
     })

     this.productService.getProducts().subscribe({

      next:(data) =>{
        this.Products = data

      },

      error:(error) =>{
        console.log(error)
      }
     })

     this.addOrderItem()
  }


  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItem(): void {

    const orderItem = new FormGroup({
      ProductID: new FormControl('',{

        validators:[Validators.required]
    
        }),
      Quantity: new FormControl('',{

        validators:[Validators.required, Validators.min(1)]
    
        }),

        Price: new FormControl('',{
 
          }),
    });
  
    this.orderItems.push(orderItem);
    console.log("vjjvv",this.orderItems)
  }

  // Update the price when a product is selected
  updatePrice(index: number, event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast to the correct element type
    const productId = Number(target.value);

console.log("dshkjss", productId)
    this.productService.getProductById(productId).subscribe({
      next:(product) => {
        const orderItem = this.orderItems.at(index);
        orderItem.get('Price')?.setValue(product.Price);
      },
      error:(error) => {
        console.error('Error fetching product price:', error);
      }
  });
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);

  }

  onSubmit(): void {
    
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;

      this.OrderService.createOrders(orderData).subscribe({
        next:(response) => {
          console.log('Order created successfully:', response);
          this.toastr.success(
            'Order Created successfully!', 'Success', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
          this.orderForm.reset();
          this.orderItems.clear();
          this.location.back()
        },
        error:(error) => {
          console.error('Error creating order:', error);
          alert('Failed to create order!');
          this.toastr.success(
            'Failed to create order!', 'error', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
        }
    });
    }
      
  }

}
