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
        // Filtrar productos que son materiales (categoría "Materiales" o productType "material")
        this.materials = products.filter(product =>
          product.category === 'Materiales' ||
          product.productType === 'material'
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
