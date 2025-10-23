import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductCustomization } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedCustomizations?: ProductCustomization[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Cargar carrito desde localStorage al iniciar
    try {
      this.loadCart();
    } catch (e) {
      // In environments without localStorage (SSR) ignore
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getTotalItems(): Observable<number> {
    return this.totalItemsSubject.asObservable();
  }

  getTotalPrice(): Observable<number> {
    return this.totalPriceSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1, selectedCustomizations: ProductCustomization[] = []): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.selectedCustomizations = selectedCustomizations.length ? selectedCustomizations : existingItem.selectedCustomizations;
    } else {
      this.cartItems.push({ product, quantity, selectedCustomizations });
    }

    this.updateCart();
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    // Actualizar observables
    this.cartSubject.next([...this.cartItems]);
    
    const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.totalItemsSubject.next(totalItems);
    
    const totalPrice = this.cartItems.reduce((total, item) => {
      const base = item.product.price;
      const extras = (item.selectedCustomizations || []).reduce((sum, customization) => sum + (customization.price || 0), 0);
      return total + ((base + extras) * item.quantity);
    }, 0);
    this.totalPriceSubject.next(totalPrice);
    
    // Guardar en localStorage
    this.saveCart();
  }

  private saveCart(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch {}
  }

  private loadCart(): void {
    if (typeof window === 'undefined') return;

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
      } catch (e) {
        this.cartItems = [];
      }
      this.updateCart();
    }
  }
}