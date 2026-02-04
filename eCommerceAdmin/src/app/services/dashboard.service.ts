import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData():Observable<any>{
    //return this.http.get('http://localhost:5000/api/dashboard')
    return this.http.get('https://phoneshop-e-commerce-1.onrender.com/api/dashboard')

  }
}
