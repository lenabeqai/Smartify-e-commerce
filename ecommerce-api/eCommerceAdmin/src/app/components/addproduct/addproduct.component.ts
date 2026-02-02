import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import {FormsModule,FormBuilder,FormGroup, ReactiveFormsModule, FormControl, Validators} from '@angular/forms'
import { CategoryService } from '../../services/category.service';
import { NgFor } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addproduct',
  standalone: true,
  imports: [FormsModule,NgFor,ReactiveFormsModule,HeaderComponent],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css'
})
export class AddproductComponent {
 
   @Input() product!:any
   
   @Input() isNew!:boolean;
 
   @Output() cancel = new EventEmitter<void>()
 
   @Output() save = new EventEmitter<void>()
 
   previewimage:boolean = false;

   selectedCategoryID! : number;

   categories:any[] = [];
 
   imagePreview: string | ArrayBuffer | null = null;

   productForm = new FormGroup({
    productName: new FormControl('',{

    validators:[Validators.required]

    }),
    Description:new FormControl('',{

      validators:[Validators.required]
    }),
    CategoryID: new FormControl('',{

      validators:[Validators.required]
    }),
    Price: new FormControl('',{

      validators:[Validators.required]
    }),
    Stock:new FormControl('',{

      validators:[Validators.required]
    }),
    image: new FormControl(''),
  });

   constructor(private ProductService:ProductService, private toastr:ToastrService, private CategoriesService: CategoryService,private router:Router, private location: Location )
   {}
 

   onPreviewImage(){
    this.previewimage = true
   }

   onClose(){
    this.previewimage = false
   }
   ngOnInit(): void {
    

     this.CategoriesService.getCategories().subscribe({
      next:(data) =>{
       this.categories = data,
       console.log("categories:", data) 
      },

      error:(error) =>
        console.log("error fetching categories")
     })
   }
 
   onSubmit()
   {
     
        
       if (this.productForm.invalid) {
        // Mark all controls as touched to display validation errors
        this.productForm.markAllAsTouched();
        return;
      }

      else
      {
       const formData = new FormData();
       Object.keys(this.productForm.controls).forEach((key) => {
        const controlValue = this.productForm.get(key)?.value;
        formData.append(key, controlValue instanceof File ? controlValue : String(controlValue));
      });

        this.ProductService.createProduct(formData).subscribe({
         next:()=>{
           console.log("added successfully", formData),
           this.toastr.success(
             'Product added successfully!', 'Success', {
                 positionClass : "toast-top-right",
                 timeOut: 3000, 
             });
             this.productForm.reset()
         },
         error:(error)=>{
           console.log("error :", error),
         console.log("oncreate",formData)
         this.toastr.error(
           'Failed to create the product.', 'Error', {
               positionClass : "toast-top-right",
               timeOut: 3000, 
           });
         }
       })

       this.save.emit()
      }
   }
 
   onCancel(){
     //this.cancel.emit()
     this.location.back()
   }

   onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ image: file });
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Save the preview URL
    };
    reader.readAsDataURL(file); // Read the file to get its base64 string
  
    
  }


 
 }
 
