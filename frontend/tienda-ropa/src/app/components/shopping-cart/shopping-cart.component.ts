import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });
  }

  updateQuantity(productId: string | undefined, quantity: number): void {
    if (productId) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: string | undefined): void {
    if (productId) {
      this.cartService.removeFromCart(productId);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    // Permitir checkout sin autenticación (compra como invitado)
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/productos']);
  }
}
