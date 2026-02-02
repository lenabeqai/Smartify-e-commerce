import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Agent } from 'http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API_URL = '/data/Products.json'//'http://localhost:5000/api/products';

  constructor(private http:HttpClient) { }

  getProducts():Observable<Product[]>{

  
    return this.http.get<Product[]>(this.API_URL);
    
  }

    getProductsByCategoryId(categoryId: number): Observable<any[]> {
    //return this.http.get<any[]>(`${this.API_URL}/category/${categoryId}`);
    return this.getProducts().pipe(
      map(products => products.filter(item => item.CategoryID === categoryId))
    );
  }

  getProductById(ProductID:number): Observable<Product| undefined> {
    //return this.http.get<Product>(`${this.API_URL}/${ProductID}`);
       return this.getProducts().pipe(
      map(products => products.find(item => item.ProductID === ProductID))
    );
  }
}
