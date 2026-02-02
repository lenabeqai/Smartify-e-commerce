import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderComponent,NgFor, RouterLink, RouterOutlet,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  orders: any[] = [];
  isNew!:boolean;

  currentPage = 1;
  itemsPerPage = 6;
  paginatedOrders: any[] = [];
  totalPages: number = 0;

  openconfirmbox:boolean = false;
  selectedid:number=0;

    selectedOrder!:any;
    OrderID!:number;

    newCategory:any = {
      Name : "",
      CategoryID:0
    };
    
   onCancel(){
   
   }

  constructor(private OrdersService: OrderService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.getOrdes();  

  }

  onSave(order:any){

    if(this.isNew)
      {
        this.OrdersService.createOrders(order).subscribe({
          next:()=>{
            console.log("added successfully"),
            this.toastr.success(
              'order added successfully!', 'Success', {
                  positionClass : "toast-top-right",
                  timeOut: 3000, 
              });
              this.getOrdes()
              this.updatePaginatedOrders()
          },
          error:(error)=>{
            console.log("error :", error),
          console.log("oncreate",order)
          this.toastr.error(
            'Failed to create the category.', 'Error', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
          }
        })
  
    }
    else{
      this.OrdersService.updateOrder(this.OrderID,this.selectedOrder).subscribe({
        next:()=>{

        this.toastr.success(
          'order updated successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.getOrdes()
          this.updatePaginatedOrders()
        },
  
        error:(error)=>
          console.log("error :", error),
        
      })
    }


  }

    updatePaginatedOrders() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);

  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }

  opendialog(){

  }
  getPaginationArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  getOrdes(): void {
    this.OrdersService.getOrders().subscribe({
      next:(data) => {
        this.orders = data.data,
   this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
    this.updatePaginatedOrders();
    console.log("orderslist:", this.orders)
      },
      error:(error) => 
        console.error('Error fetching orders:', error)
      
  });
  }

  deleteOrder(id: number): void {

    this.openconfirmbox = true
    this.selectedid = id;
   
  }

onCancelConfirm(){
  this.openconfirmbox = false
}
  onComfirmdelete(){
    this.OrdersService.deleteOrder(this.selectedid).subscribe({
      next: () => {
        this.orders = this.orders.filter((order) => order.OrderID !== this.selectedid)
        this.updatePaginatedOrders();
        this.toastr.success(
          'Order deleted successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.openconfirmbox = false
      },
      error:(error) => {
        console.error('Error deleting order:', error),
      this.toastr.error(
        'Failed to delete order.', 'Error', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      }
  });
}


  onEdit(id:number,order:any){

    this.selectedOrder = order
    this.OrderID = id
    this.router.navigate(['orders/update-order',id]);

  }

  onDisplay(id:Number){

    this.router.navigate(['orders/orderdetails',id]);

  } 
}
