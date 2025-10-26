import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService, Product } from '../../../services/product.service';
import { MaterialSelectorComponent } from '../../selectors/material-selector.component';
import { CustomizationSelectorComponent } from '../../selectors/customization-selector.component';
import { TagSelectorComponent } from '../../selectors/tag-selector.component';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialSelectorComponent,
    CustomizationSelectorComponent,
    TagSelectorComponent
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.scss']
})
export class AdminAddProductComponent {
  readonly defaultImage = 'assets/images/default-doll.svg';

  readonly categoryOptions = [
    { label: 'Muñeco', value: 'Muñecos' },
    { label: 'Material', value: 'Materiales' },
    { label: 'Curso', value: 'Cursos' }
  ];

  readonly genderOptions = ['Mujer', 'Hombre', 'Unisex', 'Decorativo', 'Coleccionable'];
  readonly targetAudienceOptions = ['Hombre', 'Mujer', 'Unisex', 'Personalizable'];

  form: FormGroup;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';
  isSubmitting = false;
  readonly backendEndpoint: string;

  // IDs seleccionados para los nuevos selectores
  selectedMaterialIds: string[] = [];
  selectedCustomizationIds: string[] = [];
  selectedTagIds: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private destroyRef: DestroyRef
  ) {
    this.form = this.buildForm();
    this.observeCategoryChanges();
    this.observeKitToggle();
    this.handleCategoryChange(this.form.get('category')?.value);
    this.handleKitToggle(!!this.form.get('isKit')?.value);
    this.backendEndpoint = this.productService.getBackendEndpoint();
  }

  get madeWith(): FormArray<FormControl<string>> {
    return this.form.get('madeWith') as FormArray<FormControl<string>>;
  }

  get kitIncludes(): FormArray<FormControl<string>> {
    return this.form.get('kitIncludes') as FormArray<FormControl<string>>;
  }

  get imageGallery(): FormArray<FormControl<string>> {
    return this.form.get('imageGallery') as FormArray<FormControl<string>>;
  }

  get tags(): FormArray<FormControl<string>> {
    return this.form.get('tags') as FormArray<FormControl<string>>;
  }

  get customizations(): FormArray<FormGroup> {
    return this.form.get('customizations') as FormArray<FormGroup>;
  }

  get isDoll(): boolean {
    return this.form.get('category')?.value === 'Muñecos';
  }

  get isMaterial(): boolean {
    return this.form.get('category')?.value === 'Materiales';
  }

  get isCourse(): boolean {
    return this.form.get('category')?.value === 'Cursos';
  }

  get showKitSection(): boolean {
    return this.isDoll && !!this.form.get('isKit')?.value;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isArrayControlInvalid(arrayName: 'madeWith' | 'kitIncludes', index: number): boolean {
    const array = this.form.get(arrayName) as FormArray<FormControl<string>>;
    const control = array?.at(index);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  addMadeWithField(): void {
    this.madeWith.push(this.createMaterialControl());
  }

  removeMadeWithField(index: number): void {
    if (this.madeWith.length > 1) {
      this.madeWith.removeAt(index);
    } else {
      this.madeWith.at(0).reset('');
    }
  }

  addKitIncludeField(): void {
    this.kitIncludes.push(this.createMaterialControl(false));
  }

  removeKitIncludeField(index: number): void {
    this.kitIncludes.removeAt(index);
  }

  addImageGalleryField(): void {
    this.imageGallery.push(this.fb.nonNullable.control('', [Validators.required]));
  }

  removeImageGalleryField(index: number): void {
    this.imageGallery.removeAt(index);
  }

  addTagField(): void {
    this.tags.push(this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(50)]));
  }

  removeTagField(index: number): void {
    this.tags.removeAt(index);
  }

  addCustomizationField(): void {
    this.customizations.push(this.createCustomizationGroup());
  }

  removeCustomizationField(index: number): void {
    this.customizations.removeAt(index);
  }

  trackByIndex(index: number): number {
    return index;
  }

  onMaterialsChanged(materialIds: string[]): void {
    this.selectedMaterialIds = materialIds;
  }

  onCustomizationsChanged(customizationIds: string[]): void {
    this.selectedCustomizationIds = customizationIds;
  }

  onTagsChanged(tagIds: string[]): void {
    this.selectedTagIds = tagIds;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const baseMaterials = this.normalizeEntries(raw.madeWith ?? []);
    const kitMaterials = this.normalizeEntries(raw.kitIncludes ?? []);

    if (baseMaterials.length === 0) {
      this.setStatus('error', 'Agrega al menos un material base.');
      return;
    }

    if (this.isDoll && raw.isKit && kitMaterials.length === 0) {
      this.setStatus('error', 'Describe los materiales incluidos en el kit.');
      return;
    }

    this.isSubmitting = true;

    const imageGalleryUrls = this.normalizeEntries(raw.imageGallery ?? []);
    const productTags = this.normalizeEntries(raw.tags ?? []);
    const customizationsList = (raw.customizations ?? []).filter((c: any) => c.label && c.label.trim());

    const product: Product = {
      name: (raw.name ?? '').toString().trim(),
      description: (raw.description ?? '').toString().trim(),
      price: Number(raw.price) || 0,
      category: raw.category ?? 'Muñecos',
      targetAudience: raw.targetAudience ?? 'Personalizable',
      dollGender: this.isDoll ? (raw.dollGender ?? 'Unisex') : undefined,
      imageUrl: (raw.imageUrl ?? this.defaultImage).toString().trim() || this.defaultImage,
      imageGallery: imageGalleryUrls.length > 0 ? imageGalleryUrls : [(raw.imageUrl ?? this.defaultImage).toString().trim()],
      stock: Number(raw.stock) || 0,
      materials: baseMaterials,
      includedMaterials: this.isDoll && raw.isKit ? kitMaterials : [],
      tags: productTags,
      customizations: customizationsList,
      isKit: this.isDoll ? !!raw.isKit : false,
      productType: this.isDoll ? 'doll' : 'material',
      allowPersonalization: this.isDoll ? !!raw.allowPersonalization : false,
      productionTimeDays: raw.productionTimeDays ? Number(raw.productionTimeDays) : undefined,
      isCourse: false,
      isAvailable: raw.isAvailable !== undefined ? !!raw.isAvailable : true
    };

    this.productService.createProductRemote(product).subscribe({
      next: () => {
        this.setStatus('success', 'Producto registrado correctamente.');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creando producto', error);
        const message = error?.error?.error || error?.message || 'No fue posible guardar el producto. Intenta de nuevo.';
        this.setStatus('error', message);
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      name: '',
      category: this.categoryOptions[0].value,
      targetAudience: 'Personalizable',
      imageUrl: this.defaultImage,
      price: 0,
      description: '',
      dollGender: 'Unisex',
      isKit: false,
      allowPersonalization: true,
      productionTimeDays: 7,
      stock: 1,
      isAvailable: true
    });

    this.madeWith.clear();
    this.madeWith.push(this.createMaterialControl());
    this.kitIncludes.clear();
    this.imageGallery.clear();
    this.tags.clear();
    this.customizations.clear();

    // Limpiar selectores
    this.selectedMaterialIds = [];
    this.selectedCustomizationIds = [];
    this.selectedTagIds = [];
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      category: [this.categoryOptions[0].value, Validators.required],
      targetAudience: ['Personalizable', Validators.required],
      imageUrl: [this.defaultImage, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(700)]],
      dollGender: ['Unisex'],
      isKit: [false],
      allowPersonalization: [true],
      productionTimeDays: [7, [Validators.min(1)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      isAvailable: [true],
      madeWith: this.fb.array<FormControl<string>>([this.createMaterialControl()]),
      kitIncludes: this.fb.array<FormControl<string>>([]),
      imageGallery: this.fb.array<FormControl<string>>([]),
      tags: this.fb.array<FormControl<string>>([]),
      customizations: this.fb.array<FormGroup>([])
    });
  }

  private observeCategoryChanges(): void {
    this.form.get('category')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.handleCategoryChange(value));
  }

  private observeKitToggle(): void {
    this.form.get('isKit')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.handleKitToggle(!!value));
  }

  private handleCategoryChange(value: string | null | undefined): void {
    const dollGenderControl = this.form.get('dollGender');
    const personalizationControl = this.form.get('allowPersonalization');
    const targetAudienceControl = this.form.get('targetAudience');

    if (value === 'Muñecos') {
      // Configuración para Muñecos
      dollGenderControl?.setValidators([Validators.required]);
      targetAudienceControl?.setValidators([Validators.required]);
      personalizationControl?.setValue(true, { emitEvent: false });
    } else {
      // Configuración para Materiales y Cursos
      dollGenderControl?.clearValidators();
      dollGenderControl?.setValue('N/A', { emitEvent: false });
      targetAudienceControl?.clearValidators();
      targetAudienceControl?.setValue('N/A', { emitEvent: false });
      personalizationControl?.setValue(false, { emitEvent: false });
      this.form.get('isKit')?.setValue(false, { emitEvent: false });
      this.kitIncludes.clear();

      // Limpiar materiales si no es muñeco
      if (this.madeWith.length > 0) {
        this.madeWith.clear();
      }
    }

    dollGenderControl?.updateValueAndValidity({ emitEvent: false });
    targetAudienceControl?.updateValueAndValidity({ emitEvent: false });
  }

  private handleKitToggle(isKit: boolean): void {
    if (isKit) {
      if (this.kitIncludes.length === 0) {
        this.addKitIncludeField();
      }
    } else {
      this.kitIncludes.clear();
    }
  }

  private createMaterialControl(required: boolean = true): FormControl<string> {
    return this.fb.nonNullable.control('', required ? [Validators.required, Validators.maxLength(120)] : [Validators.maxLength(120)]);
  }

  private createCustomizationGroup(): FormGroup {
    return this.fb.group({
      id: [this.generateCustomizationId()],
      label: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.min(0)]],
      defaultSelected: [false]
    });
  }

  private generateCustomizationId(): string {
    return 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private normalizeEntries(entries: string[] | undefined | null): string[] {
    if (!entries) {
      return [];
    }
    return entries
      .map(entry => (entry ?? '').toString().trim())
      .filter(entry => entry.length > 0);
  }

  private setStatus(type: 'success' | 'error', message: string): void {
    this.statusType = type;
    this.statusMessage = message;
    if (type === 'success') {
      setTimeout(() => {
        this.statusType = '';
        this.statusMessage = '';
      }, 4000);
    }
  }
}
