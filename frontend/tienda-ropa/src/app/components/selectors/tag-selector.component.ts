import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagService, Tag } from '../../services/tag.service';

@Component({
  selector: 'app-tag-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tag-selector">
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Buscar tags..."
          class="search-input"
        />
      </div>

      <div class="tags-container">
        <div
          *ngFor="let tag of filteredTags"
          class="tag-item"
          [class.selected]="isSelected(tag.id!)"
          (click)="toggleTag(tag)"
        >
          <span class="tag-name" [style.color]="tag.color || '#666'">
            {{ tag.name }}
          </span>
          <span class="tag-category">{{ tag.category }}</span>
        </div>
      </div>

      <div class="selected-tags" *ngIf="selectedTags.length > 0">
        <h4>Seleccionados ({{ selectedTags.length }})</h4>
        <div class="selected-list">
          <span
            *ngFor="let tag of selectedTags"
            class="selected-tag"
            [style.background-color]="tag.color || '#e0e0e0'"
          >
            {{ tag.name }}
            <button (click)="removeTag(tag)" class="remove-btn">×</button>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tag-selector {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: #f9f9f9;
    }

    .search-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 15px;
    }

    .tag-item {
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }

    .tag-item:hover {
      border-color: #007bff;
      transform: translateY(-2px);
    }

    .tag-item.selected {
      border-color: #007bff;
      background: #e7f3ff;
    }

    .tag-name {
      font-weight: 600;
      font-size: 14px;
    }

    .tag-category {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
    }

    .selected-tags h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }

    .selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .selected-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 20px;
      color: white;
      font-size: 13px;
    }

    .remove-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
  `]
})
export class TagSelectorComponent implements OnInit {
  @Input() selectedTagIds: string[] = [];
  @Output() tagsChanged = new EventEmitter<string[]>();

  allTags: Tag[] = [];
  filteredTags: Tag[] = [];
  selectedTags: Tag[] = [];
  searchQuery = '';

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.tagService.getAll({ isActive: true }).subscribe({
      next: (tags) => {
        this.allTags = tags;
        this.filteredTags = tags;
        this.updateSelectedTags();
      },
      error: (err) => console.error('Error loading tags:', err)
    });
  }

  updateSelectedTags() {
    this.selectedTags = this.allTags.filter(tag =>
      this.selectedTagIds.includes(tag.id!)
    );
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredTags = this.allTags;
      return;
    }

    this.tagService.search(this.searchQuery).subscribe({
      next: (tags) => this.filteredTags = tags,
      error: (err) => console.error('Error searching tags:', err)
    });
  }

  isSelected(tagId: string): boolean {
    return this.selectedTagIds.includes(tagId);
  }

  toggleTag(tag: Tag) {
    const index = this.selectedTagIds.indexOf(tag.id!);
    if (index > -1) {
      this.selectedTagIds.splice(index, 1);
    } else {
      this.selectedTagIds.push(tag.id!);
    }
    this.updateSelectedTags();
    this.tagsChanged.emit(this.selectedTagIds);
  }

  removeTag(tag: Tag) {
    const index = this.selectedTagIds.indexOf(tag.id!);
    if (index > -1) {
      this.selectedTagIds.splice(index, 1);
      this.updateSelectedTags();
      this.tagsChanged.emit(this.selectedTagIds);
    }
  }
}
