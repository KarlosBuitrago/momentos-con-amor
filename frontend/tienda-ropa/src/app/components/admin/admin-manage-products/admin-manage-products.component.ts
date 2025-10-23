import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-admin-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-manage-products.component.html',
  styleUrls: ['./admin-manage-products.component.scss']
})
export class AdminManageProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  isLoading = false;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';

  readonly categories = ['Todos', 'Muñecos', 'Materiales', 'Cursos'];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos', error);
        this.setStatus('error', 'Error al cargar productos');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Filtrar por categoría
    if (this.selectedCategory && this.selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.id && p.id.toLowerCase().includes(term))
      );
    }

    this.filteredProducts = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  editProduct(product: Product): void {
    if (product.id) {
      this.router.navigate(['/admin/productos/editar', product.id]);
    }
  }

  deleteProduct(product: Product): void {
    if (!product.id) return;

    const confirmed = confirm(`¿Estás seguro de eliminar "${product.name}"?`);
    if (!confirmed) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.setStatus('success', 'Producto eliminado correctamente');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error eliminando producto', error);
        this.setStatus('error', 'Error al eliminar el producto');
      }
    });
  }

  private setStatus(type: 'success' | 'error', message: string): void {
    this.statusType = type;
    this.statusMessage = message;
    setTimeout(() => {
      this.statusType = '';
      this.statusMessage = '';
    }, 4000);
  }
}
