import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  RegisterNewUser(user:User):Observable<any>{

    return this.http.post<any>('http://localhost:5000/api/users/register',user);
  }

}
