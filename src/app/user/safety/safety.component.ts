import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-safety',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './safety.component.html',
  styleUrl: './safety.component.css'
})
export class SafetyComponent {
  isNavVisible = false;

  toggleNav() {
    this.isNavVisible = !this.isNavVisible;
  }
}
