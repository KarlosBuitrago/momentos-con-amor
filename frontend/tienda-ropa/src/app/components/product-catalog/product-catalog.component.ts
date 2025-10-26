import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductCustomization } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal.component';
import { ProductCustomizationModalComponent } from '../product-customization-modal/product-customization-modal.component';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailModalComponent, ProductCustomizationModalComponent]
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading: boolean = true;
  error: string | null = null;

  // Modal states
  selectedProduct: Product | null = null;
  isDetailModalOpen = false;
  isCustomizationModalOpen = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Filtrar SOLO por categoría "Muñecos"
        const dolls = data.filter(product => product.category === 'Muñecos');
        this.products = dolls;
        this.filteredProducts = [...dolls];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  openDetailModal(product: Product): void {
    this.selectedProduct = product;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedProduct = null;
  }

  openCustomizationModal(product: Product): void {
    this.selectedProduct = product;
    this.isCustomizationModalOpen = true;
  }

  closeCustomizationModal(): void {
    this.isCustomizationModalOpen = false;
    this.selectedProduct = null;
  }

  onDetailModalAddToCart(product: Product): void {
    this.closeDetailModal();
    this.openCustomizationModal(product);
  }

  onCustomizationConfirm(data: { product: Product; customizations: ProductCustomization[]; quantity: number }): void {
    this.cartService.addToCart(data.product, data.quantity, data.customizations);
    this.closeCustomizationModal();

    // Mostrar notificación (opcional)
    alert(`${data.product.name} añadido al carrito`);
  }

  addToCart(product: Product): void {
    // Si el producto tiene personalizaciones o es un kit, abrir modal
    if (product.customizations && product.customizations.length > 0) {
      this.openCustomizationModal(product);
    } else {
      // Añadir directamente al carrito
      this.cartService.addToCart(product, 1, []);
      alert(`${product.name} añadido al carrito`);
    }
  }
}
