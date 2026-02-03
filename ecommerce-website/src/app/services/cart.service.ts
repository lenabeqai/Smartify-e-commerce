import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../guards/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

   user:any = null;

  private cartKey = ""//`cart_${this.user.user.userId}`;
  private isBrowser: boolean;
  
   private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>([]);

  cart$ = this.cartSubject.asObservable();

  private userId: string | null = null;

  //private cartCount = new BehaviorSubject<number>(this.getCount());
  //cartCount$ = this.cartCount.asObservable();

   cartCount$ = this.cart$.pipe(
  map(items => items.reduce((sum, item) => sum + item.quantity, 0))
);

 
  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);


    this.authService.user$.subscribe(user => {

  
      if (!user) {
        this.userId = null;
        this.cartItems = [];
        this.cartSubject.next([]);
        return;
      }


      this.userId = user.user?.UserID || user.UserID;
      if (this.isBrowser) {
        this.loadCart();
      }
    });
  }

  
    private get storageKey(): string {
    return this.userId ? `cart_${this.userId}` : 'cart_guest';
  }

  private loadCart(): void {
    if (!this.isBrowser) return;

    console.log("Ssssf", this.userId)
    const data = localStorage.getItem(this.storageKey);
    this.cartItems = data ? JSON.parse(data) : [];
    this.cartSubject.next([...this.cartItems]);
  }

  private saveCart():void {

    if (!this.isBrowser) return;

   localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
    console.log("mvmvmv", this.cartItems)
}

  addToCart(product: any) {
    const existing = this.cartItems.find(item => item.ProductID === product.ProductID);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1
      });
    }
 this.saveCart();
 console.log("dsddsds",this.cartItems)

  }

   Removeitem(product: any) {
    const existing = this.cartItems.find(item => item.ProductID === product.ProductID);

    if (existing) {
      existing.quantity -= 1;
    } else {
      this.cartItems.reduce({
        ...product,
        quantity: 1
      });
    }
 this.saveCart();

  }

 
  removeFromCart(id: number) {
    this.cartItems= this.cartItems.filter(item => item.ProductID !== id);

       this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  getTotal() {
    return this.cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

   
getCount(): number {
  if (!this.cartItems || this.cartItems.length === 0) {
    return 0;
  }

  return this.cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
}

  

}
