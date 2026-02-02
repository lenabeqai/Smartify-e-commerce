import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { AddcategoryComponent } from '../addcategory/addcategory.component';
import { NgFor } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AddcategoryComponent,NgFor,HeaderComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  categories: any[] = [];
  isNew!:boolean;

  currentPage = 1;
  itemsPerPage = 6;
  paginatedCategories: any[] = [];
  totalPages: number = 0;

  openconfirmbox:boolean = false;
  selectedid:number=0;

   isNewcategory:boolean = false;
   isUpdatecategory:boolean = false;
   
    selectedCategory!:any;
    categoryID!:number;

    newCategory:any = {
      Name : "",
      CategoryID:0
    };
    
   onCancel(){
    this.isNewcategory = false;
    this.isUpdatecategory = false;
   }

  constructor(private CategoriesService: CategoryService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getCategories();  

  }

  onSave(category:any){

    this.isNewcategory = false
    this.isUpdatecategory = false

    if(this.isNew)
      {
        this.CategoriesService.createCategory(category).subscribe({
          next:()=>{
            console.log("added successfully"),
            this.toastr.success(
              'Category added successfully!', 'Success', {
                  positionClass : "toast-top-right",
                  timeOut: 3000, 
              });
              this.getCategories()
              this.updatePaginatedCategories()
          },
          error:(error)=>{
            console.log("error :", error),
          console.log("oncreate",category)
          this.toastr.error(
            'Failed to create the category.', 'Error', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
          }
        })
  
    }
    else{
      this.CategoriesService.updateCategory(this.categoryID,this.selectedCategory).subscribe({
        next:()=>{

        this.toastr.success(
          'Category updated successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.getCategories()
          this.updatePaginatedCategories()
        },
  
        error:(error)=>
          console.log("error :", error),
        
      })
    }


  }

    updatePaginatedCategories() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCategories = this.categories.slice(startIndex, endIndex);

  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCategories();
    }
  }

  opendialog(){
    this.isNewcategory = true;
    this.isNew = true
  }
  getPaginationArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  getCategories(): void {
    this.CategoriesService.getCategories().subscribe({
      next:(data) => {
        this.categories = data,
   this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
    this.updatePaginatedCategories();
      },
      error:(error) => 
        console.error('Error fetching products:', error)
      
  });
  }

  deleteCategory(id: number): void {

    this.openconfirmbox = true
    this.selectedid = id;
   
  }

onCancelConfirm(){
  this.openconfirmbox = false
}
  onComfirmdelete(){
    this.CategoriesService.deleteCategory(this.selectedid).subscribe({
      next: () => {
        this.categories = this.categories.filter((category) => category.CategoryID !== this.selectedid)
        this.updatePaginatedCategories();
        this.toastr.success(
          'Category deleted successfully!', 'Success', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
          this.openconfirmbox = false
      },
      error:(error) => {
        console.error('Error deleting category:', error),
      this.toastr.error(
        'Failed to delete the category.', 'Error', {
            positionClass : "toast-top-right",
            timeOut: 3000, 
        });
      }
  });
}


  onEdit(id:number,category:any){

    this.selectedCategory = category
    this.isUpdatecategory = true
    this.isNew = false
    this.categoryID = id
    

  }

  onDisplay(id:Number){
    
  }
}
