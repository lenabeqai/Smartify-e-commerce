import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalProducts: number = 0;
  totalCategories: number = 0;
  totalOrders: number = 0;
  totalUsers: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.totalProducts = data.totalProducts;
      this.totalCategories = data.totalCategories;
      this.totalOrders = data.totalOrders;
      this.totalUsers = data.totalUsers;
    });
  }
}
