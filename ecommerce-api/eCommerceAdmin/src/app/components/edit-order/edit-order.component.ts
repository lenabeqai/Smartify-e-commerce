import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [FormsModule,NgFor,ReactiveFormsModule,HeaderComponent],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.css'
})
export class EditOrderComponent {

  orderId!:number;

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

  constructor
  (
     private OrderService: OrderService,
     private userService: UserService,
     private productService: ProductService,
     private route:ActivatedRoute,
     private toastr:ToastrService, 
     private router:Router,
     private location: Location ){}
    


  ngOnInit(){
      
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));


    this.OrderService.getOrderById(this.orderId).subscribe({

      next:(data) => {
        console.log("ddss",data)
        this.orderForm.controls.UserID.setValue(data.UserID)
        this.orderForm.controls.OrderStatus.setValue(data.OrderStatus)
       
        data.items.forEach((item: { ProductID: any; Quantity: any; Price: any; }) => {
          const orderitem = new FormGroup({
            ProductID: new FormControl(item.ProductID,{}),
            Quantity: new FormControl(item.Quantity,{}),
      
              Price: new FormControl(item.Price,{}),
          });

          this.orderItems.push(orderitem);

        });
      },

      error:(error) => {
        console.log('error:',error)
      }
    })
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

      this.OrderService.updateOrder(this.orderId,orderData).subscribe({
        next:(response) => {
          console.log('Order updated successfully:', response);
          
          this.toastr.success(
            'order updated successfully!', 'Success', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
          this.orderForm.reset();
          this.orderItems.clear();
          this.location.back()
        },
        error:(error) => {
          console.error('Error updating order:', error);
          alert('Failed to update order!');
          this.toastr.success(
            'Failed to update order!', 'error', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
        }
    });
    }
      
  }

}
