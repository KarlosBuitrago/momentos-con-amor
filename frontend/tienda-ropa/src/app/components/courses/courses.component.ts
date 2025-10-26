import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailModalComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: Product[] = [];
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
    this.loadCourses();
  }

  loadCourses(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Todos los productos:', products.length);

        // Filtrar SOLO por categoría "Cursos"
        this.courses = products.filter(product => {
          const pasa = product.category === 'Cursos';
          console.log(`${product.name}: category="${product.category}", pasa=${pasa}`);
          return pasa;
        });

        console.log('Cursos filtrados:', this.courses.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los cursos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openDetailModal(course: Product): void {
    this.selectedProduct = course;
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

  addToCart(course: Product): void {
    this.cartService.addToCart(course, 1);
    alert(`${course.name} añadido al carrito`);
  }
}
