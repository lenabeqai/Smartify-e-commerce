import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CommonModule, NgFor } from '@angular/common';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-orderdetails',
  standalone: true,
  imports: [NgFor, HeaderComponent,CommonModule],
  templateUrl: './orderdetails.component.html',
  styleUrl: './orderdetails.component.css'
})
export class OrderdetailsComponent {

  OrderId!:number
  orderitems?:any[];
orderUser?:string;
 totalamount?:number;
  orderDate?:string;
  
  constructor(private route:ActivatedRoute, private OrderService: OrderService){}

  ngOnInit(){
    this.OrderId = Number(this.route.snapshot.paramMap.get('id'));

    this.OrderService.getOrderById(this.OrderId).subscribe({
      next:(data)=>
      {
        this.orderUser = data.userName,
        this.orderDate = data.OrderDate,
        this.totalamount = data.TotalAmount

        this.orderitems = data.items
         console.log("jhkhk", data)
      },
    error:(error) =>{

    }
})

  }


}
