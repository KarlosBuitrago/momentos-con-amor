import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/product.service';
import { CustomizationService, Customization } from '../../services/customization.service';

interface CartItem extends Product {
  selectedCustomizations?: Customization[];
  totalPrice?: number;
  quantity?: number;
}

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<CartItem>();

  // Personalizaciones disponibles desde la tabla centralizada
  availableCustomizations: Customization[] = [];
  selectedCustomizationIds: Set<string> = new Set();
  quantity = 1;
  isLoadingCustomizations = false;

  constructor(private customizationService: CustomizationService) {}

  ngOnInit(): void {
    if (this.product && this.isOpen) {
      this.loadCustomizations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.product) {
      this.resetModal();
      this.loadCustomizations();
    }
  }

  loadCustomizations(): void {
    if (!this.product || !this.isDoll) {
      return;
    }

    this.isLoadingCustomizations = true;

    // Cargar personalizaciones aplicables a muñecos desde la tabla centralizada
    this.customizationService.getAll({
      applicableTo: 'doll',
      isActive: true
    }).subscribe({
      next: (customizations) => {
        this.availableCustomizations = customizations;
        this.isLoadingCustomizations = false;
      },
      error: (err) => {
        console.error('Error cargando personalizaciones:', err);
        this.isLoadingCustomizations = false;
      }
    });
  }

  get isDoll(): boolean {
    return this.product?.category === 'Muñecos';
  }

  get isMaterial(): boolean {
    return this.product?.category === 'Materiales';
  }

  get isCourse(): boolean {
    return this.product?.category === 'Cursos';
  }

  get selectedCustomizations(): Customization[] {
    return this.availableCustomizations.filter(c =>
      this.selectedCustomizationIds.has(c.id!)
    );
  }

  get customizationsTotal(): number {
    return this.selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  }

  get totalPrice(): number {
    if (!this.product) return 0;
    return (this.product.price + this.customizationsTotal) * this.quantity;
  }

  toggleCustomization(customizationId: string): void {
    if (this.selectedCustomizationIds.has(customizationId)) {
      this.selectedCustomizationIds.delete(customizationId);
    } else {
      this.selectedCustomizationIds.add(customizationId);
    }
  }

  isCustomizationSelected(customizationId: string): boolean {
    return this.selectedCustomizationIds.has(customizationId);
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  resetModal(): void {
    this.selectedCustomizationIds.clear();
    this.quantity = 1;
    this.availableCustomizations = [];
  }

  closeModal(): void {
    this.resetModal();
    this.close.emit();
  }

  onAddToCart(): void {
    if (this.product) {
      const cartItem: CartItem = {
        ...this.product,
        selectedCustomizations: this.selectedCustomizations,
        totalPrice: this.totalPrice,
        quantity: this.quantity
      };
      this.addToCart.emit(cartItem);
      this.closeModal();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
