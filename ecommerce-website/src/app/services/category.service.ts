import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private API_URL = '/data/Categories.json'//'http://localhost:5000/api/categories';

  constructor(private http:HttpClient) { }

  getcategories():Observable<any[]>{
     
    return this.http.get<any[]>(this.API_URL);
  }
}
