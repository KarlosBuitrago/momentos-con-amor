import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService, Material } from '../../services/material.service';

@Component({
  selector: 'app-material-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="material-selector">
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Buscar materiales..."
          class="search-input"
        />
        <select [(ngModel)]="typeFilter" (change)="onFilterChange()" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="thread">Hilo</option>
          <option value="filling">Relleno</option>
          <option value="accessory">Accesorio</option>
          <option value="needle">Aguja</option>
          <option value="fabric">Tela</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div class="materials-container">
        <div
          *ngFor="let material of filteredMaterials"
          class="material-item"
          [class.selected]="isSelected(material.id!)"
          (click)="toggleMaterial(material)"
        >
          <div class="material-header">
            <span class="material-name">{{ material.name }}</span>
            <span class="material-type">{{ getTypeLabel(material.type) }}</span>
          </div>
          <div class="material-details">
            <span *ngIf="material.brand" class="detail">{{ material.brand }}</span>
            <span *ngIf="material.color" class="detail color" [style.background-color]="material.color">
              {{ material.color }}
            </span>
            <span *ngIf="material.size" class="detail">{{ material.size }}</span>
          </div>
        </div>
      </div>

      <div class="selected-materials" *ngIf="selectedMaterials.length > 0">
        <h4>Seleccionados ({{ selectedMaterials.length }})</h4>
        <div class="selected-list">
          <div *ngFor="let material of selectedMaterials" class="selected-item">
            <span>{{ material.name }}</span>
            <span class="material-meta">{{ material.brand }} - {{ material.size }}</span>
            <button (click)="removeMaterial(material)" class="remove-btn">×</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .material-selector {
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
      min-width: 150px;
    }

    .materials-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 10px;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 15px;
    }

    .material-item {
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }

    .material-item:hover {
      border-color: #ff6b6b;
      transform: translateY(-2px);
    }

    .material-item.selected {
      border-color: #ff6b6b;
      background: #fff5f5;
    }

    .material-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .material-name {
      font-weight: 600;
      font-size: 14px;
    }

    .material-type {
      font-size: 11px;
      padding: 2px 6px;
      background: #e0e0e0;
      border-radius: 3px;
    }

    .material-details {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .detail {
      font-size: 11px;
      padding: 2px 6px;
      background: #f5f5f5;
      border-radius: 3px;
      color: #666;
    }

    .detail.color {
      color: white;
      font-weight: 600;
    }

    .selected-materials h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }

    .selected-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
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

    .material-meta {
      font-size: 12px;
      color: #999;
      margin-left: auto;
      margin-right: 10px;
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
  `]
})
export class MaterialSelectorComponent implements OnInit {
  @Input() selectedMaterialIds: string[] = [];
  @Output() materialsChanged = new EventEmitter<string[]>();

  allMaterials: Material[] = [];
  filteredMaterials: Material[] = [];
  selectedMaterials: Material[] = [];
  searchQuery = '';
  typeFilter = '';

  constructor(private materialService: MaterialService) {}

  ngOnInit() {
    this.loadMaterials();
  }

  loadMaterials() {
    this.materialService.getAll({ isActive: true }).subscribe({
      next: (materials) => {
        this.allMaterials = materials;
        this.filteredMaterials = materials;
        this.updateSelectedMaterials();
      },
      error: (err) => console.error('Error loading materials:', err)
    });
  }

  updateSelectedMaterials() {
    this.selectedMaterials = this.allMaterials.filter(material =>
      this.selectedMaterialIds.includes(material.id!)
    );
  }

  onSearch() {
    if (!this.searchQuery.trim() && !this.typeFilter) {
      this.filteredMaterials = this.allMaterials;
      return;
    }

    if (this.searchQuery.trim()) {
      this.materialService.search(this.searchQuery).subscribe({
        next: (materials) => {
          this.filteredMaterials = this.typeFilter
            ? materials.filter(m => m.type === this.typeFilter)
            : materials;
        },
        error: (err) => console.error('Error searching materials:', err)
      });
    } else {
      this.onFilterChange();
    }
  }

  onFilterChange() {
    this.filteredMaterials = this.typeFilter
      ? this.allMaterials.filter(m => m.type === this.typeFilter)
      : this.allMaterials;
  }

  isSelected(materialId: string): boolean {
    return this.selectedMaterialIds.includes(materialId);
  }

  toggleMaterial(material: Material) {
    const index = this.selectedMaterialIds.indexOf(material.id!);
    if (index > -1) {
      this.selectedMaterialIds.splice(index, 1);
    } else {
      this.selectedMaterialIds.push(material.id!);
    }
    this.updateSelectedMaterials();
    this.materialsChanged.emit(this.selectedMaterialIds);
  }

  removeMaterial(material: Material) {
    const index = this.selectedMaterialIds.indexOf(material.id!);
    if (index > -1) {
      this.selectedMaterialIds.splice(index, 1);
      this.updateSelectedMaterials();
      this.materialsChanged.emit(this.selectedMaterialIds);
    }
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      thread: 'Hilo',
      filling: 'Relleno',
      accessory: 'Accesorio',
      needle: 'Aguja',
      fabric: 'Tela',
      other: 'Otro'
    };
    return labels[type] || type;
  }
}
