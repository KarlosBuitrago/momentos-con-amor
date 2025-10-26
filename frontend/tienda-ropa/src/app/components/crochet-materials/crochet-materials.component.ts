import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal.component';

@Component({
  selector: 'app-crochet-materials',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailModalComponent],
  templateUrl: './crochet-materials.component.html',
  styleUrls: ['./crochet-materials.component.scss']
})
export class CrochetMaterialsComponent implements OnInit {
  materials: Product[] = [];
  loading = true;
  error = false;

  // Modal states
  selectedProduct: Product | null = null;
  isDetailModalOpen = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Todos los productos:', products.length);

        // Filtrar SOLO por categoría "Materiales"
        this.materials = products.filter(product => {
          const pasa = product.category === 'Materiales';
          console.log(`${product.name}: category="${product.category}", pasa=${pasa}`);
          return pasa;
        });

        console.log('Materiales filtrados:', this.materials.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los materiales', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openDetailModal(material: Product): void {
    this.selectedProduct = material;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedProduct = null;
  }

  onAddToCart(cartItem: any): void {
    this.cartService.addToCart(cartItem.product || cartItem, cartItem.quantity || 1);
    alert(`${cartItem.name || cartItem.product?.name} añadido al carrito`);
  }

  addToCart(material: Product): void {
    this.cartService.addToCart(material, 1);
    alert(`${material.name} añadido al carrito`);
  }
}
