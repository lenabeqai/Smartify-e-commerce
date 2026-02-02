import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders'; // Node.js API URL

  constructor(private http: HttpClient) {}

  // Get all orders
  getOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a specific order
  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create order
  createOrders(order:any): Observable<any> {
    return this.http.post('http://localhost:5000/api/orders/addorder', order);
  }

  // Update a order
  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order);
  }

  // Delete a order
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


