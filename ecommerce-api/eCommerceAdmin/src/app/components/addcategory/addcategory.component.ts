import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent {

   
  @Input() category!:any
   
  @Input() isNew!:boolean;

  @Output() cancel = new EventEmitter<void>()

  @Output() save = new EventEmitter<any>()

  title:string =  ''
  btncaption:string = ''
  
  categories:any[] = [];

  constructor(private CategoriesService:CategoryService, private toastr:ToastrService,){}

  ngOnInit(): void {
    this.title = this.isNew ? "Add Category" : "Update Category"
    this.btncaption = this.isNew ? "Add" : "Update"
  }

  onSubmit()
  {
      this.save.emit(this.category)
  }

  onCancel(){
    this.cancel.emit()
  }
}


