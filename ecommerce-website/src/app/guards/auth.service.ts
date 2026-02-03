import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { emit } from 'node:process';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://phoneshop-e-commerce-1.onrender.com/api/users'//'/data/users.json'//'http://localhost:5000/api/users';

   private token = signal<string | null>(null);

    private platformId = inject(PLATFORM_ID);

  // User observable to update header
    private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {

      // Load saved user (SSR safe)
  if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) this.token.set(savedToken);

      const savedUser = localStorage.getItem('user');
      if (savedUser) this.userSubject.next(JSON.parse(savedUser));
    }
  }

   private getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

   saveUser(u: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(u));
    }
    this.userSubject.next(u); // update header instantly
  }


  login(data: { Email: string; Password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Store token
        localStorage.setItem('user', response.user);
        this.saveUser(response.user)
      })
    ); 

    /*return this.getUsers().pipe(
      map(users => {
        const user = users.find(user => user.Email === data.Email && user.Password === data.Password)
          if (!user) {
          throw new Error('Invalid email or password');
        }
        localStorage.setItem('user', JSON.stringify(user))
        this.userSubject.next(user)
        return user
      })
    );*/
  }

   saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
    this.token.set(token);
  }

  getToken() {
    return this.token();
  }

  isLoggedIn() {
    //return this.getToken() !== null;
     return !!this.userSubject.value;
  }

   logout() {
  if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.token.set(null);
    this.userSubject.next(null);
   }

}
