import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  error = false;

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
        // Filtrar solo los productos que son cursos
        this.courses = products.filter(product => product.isCourse === true);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los cursos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  addToCart(course: any): void {
    this.cartService.addToCart(course);
  }
}