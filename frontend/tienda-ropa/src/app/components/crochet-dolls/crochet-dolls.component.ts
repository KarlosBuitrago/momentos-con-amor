import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crochet-dolls',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './crochet-dolls.component.html',
  styleUrls: ['./crochet-dolls.component.scss']
})
export class CrochetDollsComponent implements OnInit {
  dolls: any[] = [];
  loading = true;
  error = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadDolls();
  }

  loadDolls(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filtrar productos que son muñecos
        this.dolls = products.filter(product => 
          !product.isCourse && 
          (product.category === 'muñecos' || product.category === 'amigurumis')
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los muñecos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  addToCart(doll: any): void {
    this.cartService.addToCart(doll);
  }
}