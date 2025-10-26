import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomizationService, Customization } from '../../services/customization.service';

@Component({
  selector: 'app-customization-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="customization-selector">
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Buscar personalizaciones..."
          class="search-input"
        />
        <select [(ngModel)]="categoryFilter" (change)="onFilterChange()" class="filter-select">
          <option value="">Todas las categorías</option>
          <option value="accessory">Accesorios</option>
          <option value="packaging">Empaque</option>
          <option value="embroidery">Bordado</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div class="customizations-container">
        <div
          *ngFor="let custom of filteredCustomizations"
          class="customization-item"
          [class.selected]="isSelected(custom.id!)"
          (click)="toggleCustomization(custom)"
        >
          <div class="custom-info">
            <span class="custom-name">{{ custom.name }}</span>
            <span class="custom-price">\${{ custom.price.toLocaleString() }}</span>
          </div>
          <span class="custom-category">{{ getCategoryLabel(custom.category) }}</span>
          <span class="custom-applicable">{{ getApplicableLabel(custom.applicableTo) }}</span>
        </div>
      </div>

      <div class="selected-customizations" *ngIf="selectedCustomizations.length > 0">
        <h4>Seleccionadas ({{ selectedCustomizations.length }})</h4>
        <div class="selected-list">
          <div *ngFor="let custom of selectedCustomizations" class="selected-item">
            <span>{{ custom.name }} - \${{ custom.price.toLocaleString() }}</span>
            <button (click)="removeCustomization(custom)" class="remove-btn">×</button>
          </div>
        </div>
        <div class="total-price">
          <strong>Total: \${{ getTotalPrice().toLocaleString() }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customization-selector {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: #f9f9f9;
    }

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }

    .search-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .filter-select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 180px;
    }

    .customizations-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 10px;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 15px;
    }

    .customization-item {
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }

    .customization-item:hover {
      border-color: #28a745;
      transform: translateY(-2px);
    }

    .customization-item.selected {
      border-color: #28a745;
      background: #e8f5e9;
    }

    .custom-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .custom-name {
      font-weight: 600;
      font-size: 14px;
    }

    .custom-price {
      color: #28a745;
      font-weight: 700;
    }

    .custom-category, .custom-applicable {
      display: block;
      font-size: 11px;
      color: #999;
      margin-top: 4px;
    }

    .selected-customizations h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }

    .selected-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .selected-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .remove-btn {
      background: #dc3545;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0 8px;
      border-radius: 4px;
      line-height: 1;
    }

    .total-price {
      padding: 10px;
      background: #28a745;
      color: white;
      border-radius: 4px;
      text-align: center;
    }
  `]
})
export class CustomizationSelectorComponent implements OnInit {
  @Input() selectedCustomizationIds: string[] = [];
  @Input() productType: 'doll' | 'kit' | 'material' | 'course' = 'doll';
  @Output() customizationsChanged = new EventEmitter<string[]>();

  allCustomizations: Customization[] = [];
  filteredCustomizations: Customization[] = [];
  selectedCustomizations: Customization[] = [];
  searchQuery = '';
  categoryFilter = '';

  constructor(private customizationService: CustomizationService) {}

  ngOnInit() {
    this.loadCustomizations();
  }

  loadCustomizations() {
    this.customizationService.getAll({
      isActive: true,
      applicableTo: this.productType
    }).subscribe({
      next: (customizations) => {
        this.allCustomizations = customizations;
        this.filteredCustomizations = customizations;
        this.updateSelectedCustomizations();
      },
      error: (err) => console.error('Error loading customizations:', err)
    });
  }

  updateSelectedCustomizations() {
    this.selectedCustomizations = this.allCustomizations.filter(custom =>
      this.selectedCustomizationIds.includes(custom.id!)
    );
  }

  onSearch() {
    if (!this.searchQuery.trim() && !this.categoryFilter) {
      this.filteredCustomizations = this.allCustomizations;
      return;
    }

    if (this.searchQuery.trim()) {
      this.customizationService.search(this.searchQuery).subscribe({
        next: (customizations) => {
          this.filteredCustomizations = this.categoryFilter
            ? customizations.filter(c => c.category === this.categoryFilter)
            : customizations;
        },
        error: (err) => console.error('Error searching customizations:', err)
      });
    } else {
      this.onFilterChange();
    }
  }

  onFilterChange() {
    this.filteredCustomizations = this.categoryFilter
      ? this.allCustomizations.filter(c => c.category === this.categoryFilter)
      : this.allCustomizations;
  }

  isSelected(customId: string): boolean {
    return this.selectedCustomizationIds.includes(customId);
  }

  toggleCustomization(custom: Customization) {
    const index = this.selectedCustomizationIds.indexOf(custom.id!);
    if (index > -1) {
      this.selectedCustomizationIds.splice(index, 1);
    } else {
      this.selectedCustomizationIds.push(custom.id!);
    }
    this.updateSelectedCustomizations();
    this.customizationsChanged.emit(this.selectedCustomizationIds);
  }

  removeCustomization(custom: Customization) {
    const index = this.selectedCustomizationIds.indexOf(custom.id!);
    if (index > -1) {
      this.selectedCustomizationIds.splice(index, 1);
      this.updateSelectedCustomizations();
      this.customizationsChanged.emit(this.selectedCustomizationIds);
    }
  }

  getTotalPrice(): number {
    return this.selectedCustomizations.reduce((sum, custom) => sum + custom.price, 0);
  }

  getCategoryLabel(category: string): string {
    const labels: any = {
      accessory: 'Accesorio',
      packaging: 'Empaque',
      embroidery: 'Bordado',
      other: 'Otro'
    };
    return labels[category] || category;
  }

  getApplicableLabel(applicableTo: string[]): string {
    return `Aplicable a: ${applicableTo.join(', ')}`;
  }
}
