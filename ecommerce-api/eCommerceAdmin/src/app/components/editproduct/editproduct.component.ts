import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Location} from '@angular/common';

@Component({
  selector: 'app-editproduct',
  standalone: true,
  imports: [FormsModule,NgFor,ReactiveFormsModule,HeaderComponent],
  templateUrl: './editproduct.component.html',
  styleUrl: './editproduct.component.css'
})
export class EditproductComponent {

  @Input() product!:any
   

  previewimage:boolean = false;

  selectedCategoryID! : number;

  productId!: number;

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

  constructor(private route:ActivatedRoute, private ProductService:ProductService, private toastr:ToastrService, private CategoriesService: CategoryService,private router:Router, private location: Location )
  {}


  onPreviewImage(){
   this.previewimage = true
  }

  onClose(){
   this.previewimage = false
  }
  ngOnInit(): void {
   
     this.productId = Number(this.route.snapshot.paramMap.get('id'));
     

    console.log('Product ID:', this.product);

    this.CategoriesService.getCategories().subscribe({
     next:(data) =>{
      this.categories = data,
      console.log("categories:", data) 
     },

     error:(error) =>
       console.log("error fetching categories")
    })


    this.ProductService.getProductById(this.productId).subscribe({
      next:(data)=>
      {
            this.product = data
            console.log("product:",this.product)
            this.productForm.patchValue({
              productName: this.product.Name,
              Description: this.product.Description,
              CategoryID: this.product.CategoryID,
              Price: this.product.Price,
              Stock: this.product.Stock,
              image: this.product.imagePath,
            });

            if(this.product.ImagePath != null)
            {
            this.imagePreview = "http://localhost:5000"+this.product.ImagePath
            console.log(this.imagePreview)
            }
      },

      error:(error) =>{
        console.log(error)
      }
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

       this.ProductService.updateProduct(this.productId,formData).subscribe({
        next:()=>{
          console.log("updated successfully", formData),
          this.toastr.success(
            'Product updated successfully!', 'Success', {
                positionClass : "toast-top-right",
                timeOut: 3000, 
            });
            this.productForm.reset()
        },
        error:(error)=>{
          console.log("error :", error),
        console.log("oncreate",formData)
        this.toastr.error(
          'Failed to update the product.', 'Error', {
              positionClass : "toast-top-right",
              timeOut: 3000, 
          });
        }
      })

     }
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

 onCancel(){
  //this.cancel.emit()
  this.location.back()
}

}


