import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InvoiceItem {
  productId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customizations?: Array<{
    name: string;
    price: number;
  }>;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  orderId: string;
  date: Date;
  dueDate?: Date;

  // Información del cliente
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    documentType?: 'CC' | 'NIT' | 'CE';
    documentNumber?: string;
  };

  // Items de la factura
  items: InvoiceItem[];

  // Totales
  subtotal: number;
  tax: number;
  taxPercentage: number;
  discount: number;
  shipping: number;
  total: number;

  // Estado
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';

  // Notas
  notes?: string;
  terms?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  paidAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  /**
   * Genera una factura para una orden
   */
  generateInvoice(orderData: any): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/generate`, orderData);
  }

  /**
   * Obtiene una factura por ID
   */
  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`);
  }

  /**
   * Obtiene una factura por número de factura
   */
  getInvoiceByNumber(invoiceNumber: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/number/${invoiceNumber}`);
  }

  /**
   * Confirma el pago de una factura
   */
  confirmPayment(invoiceId: string, paymentData?: any): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${invoiceId}/confirm-payment`, paymentData || {});
  }

  /**
   * Cancela una factura
   */
  cancelInvoice(invoiceId: string, reason?: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${invoiceId}/cancel`, { reason });
  }

  /**
   * Descarga la factura en PDF
   */
  downloadInvoicePDF(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${invoiceId}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Envía la factura por email
   */
  sendInvoiceByEmail(invoiceId: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${invoiceId}/send-email`, { email });
  }

  /**
   * Genera el número de factura
   */
  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  /**
   * Calcula el total de la factura
   */
  calculateInvoiceTotal(items: InvoiceItem[], taxPercentage: number = 0, shipping: number = 0, discount: number = 0): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = (subtotal * taxPercentage) / 100;
    const total = subtotal + tax + shipping - discount;

    return {
      subtotal,
      tax,
      total
    };
  }

  /**
   * Formatea un número como moneda COP
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
