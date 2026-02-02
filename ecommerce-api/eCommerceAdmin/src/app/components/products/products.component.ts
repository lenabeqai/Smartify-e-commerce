import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor } from '@angular/common';
import { AddproductComponent } from '../addproduct/addproduct.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor,AddproductComponent,HeaderComponent,RouterLink,RouterOutlet,RouterLinkActive],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: any[] = [];
  isNew!:boolean;

  currentPage = 1;
  itemsPerPage = 6;
  paginatedProducts: any[] = [];
  totalPages: number = 0;

  openconfirmbox:boolean = false;
  selectedid:number=0;

   isNewproduct:boolean = false;
   isUpdateproduct:boolean = false;
   
    selectedProduct!:any;
    productID!:number;

    newProduct:any = {
      productName : "",
      Description : "",
      Price : 0,
      Stock : 0,
      CategoryID:0,
      image:null
    };
    
   onCancel(){
    this.isNewproduct = false;
    this.isUpdateproduct = false;
   }

  constructor(private productService: ProductService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();  

  }

  onSave(){

    this.isNewproduct = false
    this.isUpdateproduct = false

    if(!this.isNew)
    {
    this.productService.updateProduct(this.productID,this.selectedProduct).subscribe({
      next:()=>{
        this.getProducts()
      this.updatePaginatedProducts()
      this.toastr.success(
        'Product updated successfully!', 'Success', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      },

      error:(error)=>
        console.log("error :", error),
      
    })
  }
  }
    updatePaginatedProducts() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);

  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  opendialog(){
    this.isNewproduct = true;
    this.isNew = true
  }


  getPaginationArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next:(data) => {
        this.products = data,
        console.log(this.products)
   this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.updatePaginatedProducts();
      },
      error:(error) => 
        console.error('Error fetching products:', error)
      
  });
  }

  deleteProduct(id: number): void {

    this.openconfirmbox = true
    this.selectedid = id;
   
  }

onCancelConfirm(){
  this.openconfirmbox = false
}
  onComfirmdelete(){
    this.productService.deleteProduct(this.selectedid).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.productID !== this.selectedid)
        this.getProducts()
        this.updatePaginatedProducts();
        this.toastr.success(
          'Product deleted successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.openconfirmbox = false
      },
      error:(error) => {
        console.error('Error deleting product:', error),
      this.toastr.error(
        'Failed to delete the product.', 'Error', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
        this.openconfirmbox = false
      }
  });
}


  onEdit(id:number,product:any){

    this.selectedProduct = product
    this.isUpdateproduct = true
    this.isNew = false
    this.productID = id
    this.router.navigate(['products/updateproduct',id]);

  }

  onDisplay(id:Number){
    
  }

  
}

