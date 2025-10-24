import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService, Product, ProductCustomization } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="product-detail" *ngIf="product; else loadingOrNotFound">
      <div class="detail-image">
        <img [src]="product.imageUrl || 'assets/images/default-doll.svg'" [alt]="product.name">
      </div>
      <div class="detail-info">
        <h2>{{ product.name }}</h2>
        <p class="price">{{ product.price | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
        <p class="category">{{ product.category }} · {{ product.targetAudience }}</p>
        <p class="description">{{ product.description }}</p>
        <p *ngIf="product.materials && product.materials.length">Materiales: {{ product.materials.join(', ') }}</p>

        <form [formGroup]="customizationForm" (ngSubmit)="addToCart()" *ngIf="product.customizations?.length">
          <fieldset class="customization-group" formArrayName="customizations">
            <legend>Personaliza tu muñeco</legend>
            <label class="customization-option" *ngFor="let control of customizationArray.controls; let i = index">
              <input type="checkbox" [formControlName]="i">
              <span>{{ product.customizations?.[i]?.label }}</span>
              <span *ngIf="product.customizations?.[i]?.price" class="price-extra">(+{{ product.customizations?.[i]?.price | currency:'COP':'symbol-narrow':'1.0-0' }})</span>
            </label>
          </fieldset>
          <button type="submit">Añadir al carrito</button>
        </form>

        <button *ngIf="!product.customizations?.length" (click)="addToCart()">Añadir al carrito</button>
        <div class="actions">
          <button routerLink="/carrito">Ir al carrito</button>
        </div>
      </div>
    </div>
    <ng-template #loadingOrNotFound>
      <div class="loading">Cargando producto...</div>
    </ng-template>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  customizationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.customizationForm = this.fb.group({
      customizations: this.fb.array([])
    });
  }

  get customizationArray(): FormArray {
    return this.customizationForm.get('customizations') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (p) => {
          this.product = p;
          this.buildCustomizationForm();
        },
        error: () => this.product = null
      });
    }
  }

  private buildCustomizationForm(): void {
    const controls = this.product?.customizations?.map(customization => this.fb.control(customization.defaultSelected ?? false)) || [];
    this.customizationForm.setControl('customizations', this.fb.array(controls));
  }

  addToCart(): void {
    if (!this.product) return;

    const selectedCustomizations: ProductCustomization[] = [];
    const selections = ((this.customizationArray.value as Array<boolean | null | undefined>) || []).map(value => !!value);

    this.product.customizations?.forEach((customization, index) => {
      if (selections[index]) {
        selectedCustomizations.push(customization);
      }
    });

    this.cartService.addToCart(this.product, 1, selectedCustomizations);
  }
}
