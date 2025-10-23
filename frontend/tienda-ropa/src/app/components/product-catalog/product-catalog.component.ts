import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductCustomization } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading: boolean = true;
  error: string | null = null;

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
        this.products = data;
        this.filteredProducts = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    const defaultCustomizations: ProductCustomization[] = (product.customizations || []).filter(c => c.defaultSelected);
    this.cartService.addToCart(product, 1, defaultCustomizations);
  }
}
