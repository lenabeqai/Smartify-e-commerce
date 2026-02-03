import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://phoneshop-e-commerce-1.onrender.com/api/products'//'http://localhost:5000/api/products'; // Node.js API URL

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a specific product
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a product
  createProduct(formData: FormData): Observable<any> {
    //return this.http.post('http://localhost:5000/api/products/create', formData);
    return this.http.post('https://phoneshop-e-commerce-1.onrender.com/api/products/create', formData);

  }

  // Update a product
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

