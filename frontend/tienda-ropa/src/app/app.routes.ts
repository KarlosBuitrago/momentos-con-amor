import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/product-catalog/product-catalog.component').then(m => m.ProductCatalogComponent) },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
  { path: 'productos/:id', loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'productos', loadComponent: () => import('./components/product-catalog/product-catalog.component').then(m => m.ProductCatalogComponent) },
  { path: 'materiales', loadComponent: () => import('./components/crochet-materials/crochet-materials.component').then(m => m.CrochetMaterialsComponent) },
  { path: 'cursos', loadComponent: () => import('./components/courses/courses.component').then(m => m.CoursesComponent) },
  { path: 'carrito', loadComponent: () => import('./components/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [() => inject(AuthService).isAuthenticated() && inject(AuthService).isAdmin() ? true : inject(Router).createUrlTree(['/login'])]
  },
  {
    path: 'admin/productos/editar/:id',
    loadComponent: () => import('./components/admin/admin-edit-product/admin-edit-product.component').then(m => m.AdminEditProductComponent),
    canActivate: [() => inject(AuthService).isAuthenticated() && inject(AuthService).isAdmin() ? true : inject(Router).createUrlTree(['/login'])]
  },
  { path: 'admin/productos', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
