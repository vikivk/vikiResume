import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'About',
    loadComponent: () =>
      import('./user/about/about.component').then(
        (c) => c.AboutComponent
      ),
  },
  {
    path: 'Safety',
    loadComponent: () =>
      import('./user/safety/safety.component').then(
        (c) => c.SafetyComponent
      ),
  },
  {
    path: 'Productitem',
    loadComponent: () =>
      import('./user/productitem/productitem.component').then(
        (c) => c.ProductitemComponent
      ),
  },
  {
    path: 'Contact',
    loadComponent: () =>
      import('./user/contactus/contactus.component').then(
        (c) => c.ContactusComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./adminlogin/adminlogin.component').then(
        (c) => c.AdminloginComponent
      ),
  },
  {
    path: '', // Empty path for layout to wrap other routes
    component: LayoutComponent, // Wrapper Layout with Menu
    children: [
      {
        path: 'Menu',
        loadComponent: () =>
          import('./menu/menu.component').then(
            (c) => c.MenuComponent
          ),
      },
      {
        path: 'Dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        canActivate: [AuthGuard], // Apply the AuthGuard to Dashboard route
      },
      {
        path: 'Product',
        loadComponent: () =>
          import('./product/product.component').then(
            (c) => c.ProductComponent
          ),
        canActivate: [AuthGuard], // Apply the AuthGuard to Product route
      },
      {
        path: 'Ptype',
        loadComponent: () =>
          import('./add-type/add-type.component').then(
            (c) => c.AddTypeComponent
          ),
        canActivate: [AuthGuard], // AuthGuard added here as well
      },
      {
        path: 'OrderDetails',
        loadComponent: () =>
          import('./order-details/order-details.component').then(
            (c) => c.OrderDetailsComponent
          ),
        canActivate: [AuthGuard], // Protected by AuthGuard
      },
      {
        path: 'Stock',
        loadComponent: () =>
          import('./stock/stock.component').then(
            (c) => c.StockComponent
          ),
        canActivate: [AuthGuard], // Protected by AuthGuard
      },
    ],
  },
];
