import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.scss']
})
export class AdminEditProductComponent implements OnInit {
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
  isLoading = true;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (!this.productId) {
      this.router.navigate(['/admin']);
      return;
    }

    this.loadProduct(this.productId);
    this.observeCategoryChanges();
    this.observeKitToggle();
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.populateForm(product);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando producto', error);
        this.setStatus('error', 'No se pudo cargar el producto');
        this.isLoading = false;
      }
    });
  }

  populateForm(product: Product): void {
    this.form.patchValue({
      name: product.name,
      category: product.category,
      targetAudience: product.targetAudience,
      imageUrl: product.imageUrl || this.defaultImage,
      price: product.price,
      description: product.description,
      dollGender: product.dollGender || 'Unisex',
      isKit: product.isKit || false,
      allowPersonalization: product.allowPersonalization || false,
      productionTimeDays: product.productionTimeDays || 7,
      stock: product.stock,
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
    });

    // Populate arrays
    this.madeWith.clear();
    (product.materials || []).forEach(material => {
      this.madeWith.push(this.fb.nonNullable.control(material, [Validators.required, Validators.maxLength(120)]));
    });
    if (this.madeWith.length === 0) {
      this.madeWith.push(this.createMaterialControl());
    }

    this.kitIncludes.clear();
    (product.includedMaterials || []).forEach(material => {
      this.kitIncludes.push(this.fb.nonNullable.control(material, [Validators.maxLength(120)]));
    });

    this.imageGallery.clear();
    (product.imageGallery || []).forEach(url => {
      this.imageGallery.push(this.fb.nonNullable.control(url, [Validators.required]));
    });

    this.tags.clear();
    (product.tags || []).forEach(tag => {
      this.tags.push(this.fb.nonNullable.control(tag, [Validators.required, Validators.maxLength(50)]));
    });

    this.customizations.clear();
    (product.customizations || []).forEach(custom => {
      this.customizations.push(this.fb.group({
        id: [custom.id],
        label: [custom.label, [Validators.required, Validators.maxLength(100)]],
        price: [custom.price || 0, [Validators.min(0)]],
        defaultSelected: [custom.defaultSelected || false]
      }));
    });

    this.handleCategoryChange(product.category);
    this.handleKitToggle(!!product.isKit);
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.productId) return;

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

    const productUpdate: Partial<Product> = {
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

    this.productService.updateProduct(this.productId, productUpdate).subscribe({
      next: () => {
        this.setStatus('success', 'Producto actualizado correctamente.');
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error actualizando producto', error);
        const message = error?.error?.error || error?.message || 'No fue posible actualizar el producto.';
        this.setStatus('error', message);
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin']);
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

    if (value === 'Muñecos') {
      dollGenderControl?.setValidators([Validators.required]);
      personalizationControl?.setValue(true, { emitEvent: false });
    } else {
      dollGenderControl?.clearValidators();
      dollGenderControl?.setValue('N/A', { emitEvent: false });
      personalizationControl?.setValue(false, { emitEvent: false });
      this.form.get('isKit')?.setValue(false, { emitEvent: false });
      this.kitIncludes.clear();
    }

    dollGenderControl?.updateValueAndValidity({ emitEvent: false });
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
