import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  totalPrice: number = 0;
  loading: boolean = false;
  error: string = '';
  success: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      paymentMethod: ['efectivo', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Cargar datos del usuario si está autenticado
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || ''
      });
    }

    // Cargar items del carrito
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });

    // Obtener precio total
    this.cartService.getTotalPrice().subscribe(total => {
      this.totalPrice = total;
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.loading = true;

    // Crear objeto de orden
    const order = {
      userId: this.authService.getCurrentUser()?.id || 'guest',
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalPrice: this.totalPrice,
      shippingDetails: {
        fullName: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        postalCode: this.checkoutForm.value.postalCode,
        phone: this.checkoutForm.value.phone
      },
      paymentMethod: this.checkoutForm.value.paymentMethod,
      status: 'pendiente',
      createdAt: new Date()
    };

    // Enviar orden al backend
    this.http.post(`${environment.apiUrl}/orders`, order)
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.success = true;
          this.cartService.clearCart();
          setTimeout(() => {
            this.router.navigate(['/perfil/pedidos']);
          }, 3000);
        },
        error => {
          this.loading = false;
          this.error = 'Error al procesar el pedido. Por favor, inténtalo de nuevo.';
          console.error('Error al crear pedido:', error);
        }
      );
  }
}
