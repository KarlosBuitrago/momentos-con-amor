import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductCustomization } from '../../services/product.service';

interface CustomizationSelection {
  customization: ProductCustomization;
  selected: boolean;
}

@Component({
  selector: 'app-product-customization-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-customization-modal.component.html',
  styleUrls: ['./product-customization-modal.component.scss']
})
export class ProductCustomizationModalComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ product: Product; customizations: ProductCustomization[]; quantity: number }>();

  customizations: CustomizationSelection[] = [];
  quantity = 1;

  ngOnInit(): void {
    this.initializeCustomizations();
  }

  ngOnChanges(): void {
    this.initializeCustomizations();
  }

  initializeCustomizations(): void {
    if (this.product?.customizations) {
      this.customizations = this.product.customizations.map(c => ({
        customization: c,
        selected: c.defaultSelected || false
      }));
    }
  }

  get totalPrice(): number {
    if (!this.product) return 0;

    const basePrice = this.product.price;
    const customizationsPrice = this.customizations
      .filter(c => c.selected && c.customization.price)
      .reduce((sum, c) => sum + (c.customization.price || 0), 0);

    return (basePrice + customizationsPrice) * this.quantity;
  }

  get selectedCustomizations(): ProductCustomization[] {
    return this.customizations
      .filter(c => c.selected)
      .map(c => c.customization);
  }

  closeModal(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (this.product) {
      this.confirm.emit({
        product: this.product,
        customizations: this.selectedCustomizations,
        quantity: this.quantity
      });
      this.closeModal();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
