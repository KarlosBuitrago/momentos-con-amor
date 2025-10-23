import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crochet-materials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './crochet-materials.component.html',
  styleUrls: ['./crochet-materials.component.scss']
})
export class CrochetMaterialsComponent implements OnInit {
  materials: any[] = [];
  loading = true;
  error = false;

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
        // Filtrar productos que son materiales (no son cursos y pertenecen a categoría de materiales)
        this.materials = products.filter(product => 
          !product.isCourse && 
          (product.category === 'materiales' || product.category === 'hilos' || product.category === 'agujas')
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los materiales', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  addToCart(material: any): void {
    this.cartService.addToCart(material);
  }
}