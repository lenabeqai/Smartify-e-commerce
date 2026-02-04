import { HttpClient } from '@angular/common/http';
import { Injectable, numberAttribute } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'https://phoneshop-e-commerce-1.onrender.com/api/categories'//'http://localhost:5000/api/categories'; // Node.js API URL

  constructor(private http:HttpClient) { }


  getCategories():Observable<any>{
    return this.http.get(this.apiUrl)
  }

  updateCategory(id:number, category:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`,category)
  }

  createCategory(category:any):Observable<any>{
    return this.http.post(this.apiUrl,category)
  }

  deleteCategory(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
