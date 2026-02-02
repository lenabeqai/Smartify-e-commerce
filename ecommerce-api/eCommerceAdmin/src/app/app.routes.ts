import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AddproductComponent } from './components/addproduct/addproduct.component';
import { EditproductComponent } from './components/editproduct/editproduct.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderdetailsComponent } from './components/orderdetails/orderdetails.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 

  {path:'dashboard', component:DashboardComponent, canActivate: [authGuard]},

  {path:'login', component:LoginComponent},
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { 
    path: 'products', 
    component: ProductsComponent, canActivate: [authGuard]
  },

  {
    path:'orders',
    component:OrdersComponent, canActivate: [authGuard]
  },

  {
    path:"orders/createorder",
    component:CreateOrderComponent, canActivate: [authGuard]
  },

  {
    path:"orders/update-order/:id",
    component:EditOrderComponent, canActivate: [authGuard]
  },
  
  {
    path:'orders/orderdetails/:id',
    component:OrderdetailsComponent, canActivate: [authGuard]
  },

  {
    path:'products/addproduct',
    component:AddproductComponent, canActivate: [authGuard]
  },

  {
    path:'products/updateproduct/:id',
    component:EditproductComponent, canActivate: [authGuard]
  },


  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
 
  // Default route
];


