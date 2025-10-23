import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminAddProductComponent } from '../admin-add-product/admin-add-product.component';
import { AdminManageProductsComponent } from '../admin-manage-products/admin-manage-products.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  imports: [CommonModule, AdminAddProductComponent, AdminManageProductsComponent],
  standalone: true
})
export class AdminPanelComponent implements OnInit {
  isAdmin = true;
  loading = true;
  activeTab: 'add' | 'manage' = 'manage';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario es admin
    const user = this.authService.getCurrentUser();
    const isAdmin = this.authService.isAdmin();

    if (isAdmin && user) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
      this.router.navigate(['/login']);
    }

    this.loading = false;
  }

  setActiveTab(tab: 'add' | 'manage'): void {
    this.activeTab = tab;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
