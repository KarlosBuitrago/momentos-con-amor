import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { InvoiceService, Invoice } from '../../services/invoice.service';
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

  // Estados del proceso
  currentStep: 'form' | 'invoice' | 'confirmed' = 'form';
  generatedInvoice: Invoice | null = null;
  confirmingPayment: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private invoiceService: InvoiceService,
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
    this.error = '';

    // Preparar datos para la factura
    const invoiceData = {
      customer: {
        name: this.checkoutForm.value.fullName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        postalCode: this.checkoutForm.value.postalCode
      },
      items: this.cartItems.map(item => {
        // Calcular precio de personalizaciones
        const customizationsPrice = (item.selectedCustomizations || [])
          .reduce((sum: number, custom: any) => sum + (custom.price || 0), 0);

        const totalItemPrice = item.product.price + customizationsPrice;

        return {
          productId: item.product.id || 'unknown',
          name: item.product.name,
          description: item.product.description || '',
          quantity: item.quantity,
          unitPrice: totalItemPrice,
          subtotal: totalItemPrice * item.quantity,
          customizations: (item.selectedCustomizations || []).map((custom: any) => ({
            name: custom.label,
            price: custom.price || 0
          }))
        };
      }),
      paymentMethod: this.checkoutForm.value.paymentMethod,
      userId: this.authService.getCurrentUser()?.id || 'guest'
    };

    console.log('Enviando datos de factura:', invoiceData);

    // Generar factura
    this.invoiceService.generateInvoice(invoiceData).subscribe({
      next: (invoice) => {
        this.loading = false;
        this.generatedInvoice = invoice;
        this.currentStep = 'invoice';
        console.log('Factura generada exitosamente:', invoice);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error completo al generar factura:', error);

        // Mostrar mensaje de error más específico
        if (error.error && error.error.error) {
          this.error = `Error: ${error.error.error}`;
        } else if (error.message) {
          this.error = `Error: ${error.message}`;
        } else {
          this.error = 'Error al generar la factura. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }

  confirmPayment(): void {
    if (!this.generatedInvoice) {
      return;
    }

    this.confirmingPayment = true;
    this.error = '';

    this.invoiceService.confirmPayment(this.generatedInvoice.id!).subscribe({
      next: (updatedInvoice) => {
        this.confirmingPayment = false;
        this.generatedInvoice = updatedInvoice;
        this.currentStep = 'confirmed';
        this.success = true;

        // Vaciar el carrito
        this.cartService.clearCart();

        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/perfil/pedidos']);
        }, 3000);
      },
      error: (error) => {
        this.confirmingPayment = false;
        this.error = 'Error al confirmar el pago. Por favor, inténtalo de nuevo.';
        console.error('Error al confirmar pago:', error);
      }
    });
  }

  cancelInvoice(): void {
    if (!this.generatedInvoice) {
      return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar esta factura?')) {
      this.invoiceService.cancelInvoice(this.generatedInvoice.id!, 'Cancelado por el usuario').subscribe({
        next: () => {
          this.currentStep = 'form';
          this.generatedInvoice = null;
        },
        error: (error) => {
          this.error = 'Error al cancelar la factura.';
          console.error('Error al cancelar factura:', error);
        }
      });
    }
  }

  downloadInvoice(): void {
    if (!this.generatedInvoice) {
      return;
    }

    this.invoiceService.downloadInvoicePDF(this.generatedInvoice.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Factura-${this.generatedInvoice!.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.error = 'Error al descargar la factura.';
        console.error('Error al descargar factura:', error);
      }
    });
  }

  formatCurrency(amount: number): string {
    return this.invoiceService.formatCurrency(amount);
  }

  formatDate(date: any): string {
    if (!date) return '';

    // Si es un timestamp de Firestore
    if (date._seconds) {
      const jsDate = new Date(date._seconds * 1000);
      return jsDate.toLocaleDateString('es-CO');
    }

    // Si ya es una fecha
    if (date instanceof Date) {
      return date.toLocaleDateString('es-CO');
    }

    // Si es un string
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('es-CO');
    }

    return '';
  }
}
