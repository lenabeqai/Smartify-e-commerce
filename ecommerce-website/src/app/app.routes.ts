import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'node:path';
import { HomeComponent } from './components/home/home.component';
import { ProductsByCategoryComponent } from './components/Products/products-by-category/products-by-category.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [

    { path:'home',component:HomeComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    { path:'cart',
      canActivate:[authGuard],
      component:CartComponent},


    {
      path: 'category/:Id/:name', 
      component:ProductsByCategoryComponent},

    {
  path: 'product/:id',
  loadComponent: () => import('./components/product-detail/product-detail.component')
    .then(m => m.ProductDetailComponent)
},

{path:'login', component:LoginComponent}

];
