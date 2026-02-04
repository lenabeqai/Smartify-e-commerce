
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://phoneshop-e-commerce-1.onrender.com/api/users'//'http://localhost:5000/api/users'; // Node.js API URL

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a specific user
  //getUserById(id: number): Observable<any> {
    //return this.http.get(`${this.apiUrl}/${id}`);
  //}

  //login
 
  login(Email:string, Password:string): Observable<any> {

    return this.http.post(`${this.apiUrl}/login`, { Email, Password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Store token
        localStorage.setItem('username', response.user.Username);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Create a user
  createUser(user: any): Observable<any> {
    return this.http.post("http://localhost:5000/api/users/register", user);
  }

  // Update a user
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
