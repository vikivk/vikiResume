import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  // Correct import statement

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] // Fixed to styleUrls
})
export class MenuComponent  {
  constructor(private router: Router) {}
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  logout() {
    // Remove session data or auth token
    sessionStorage.removeItem('authToken');
    
    // Optionally, you can clear the entire session storage
    // sessionStorage.clear();

    // Redirect to the login page after logging out
    this.router.navigate(['/login']);
  }
}
