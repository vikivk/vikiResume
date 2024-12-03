import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Corrected to styleUrls
})
export class HomeComponent implements OnInit {  // Added implements OnInit
  isNavVisible = false;
  isPopupVisible: boolean = false;

  toggleNav() {
    this.isNavVisible = !this.isNavVisible;
  }

  ngOnInit(): void {
    // Show the popup automatically when the component loads
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  subscribe(): void {
    // Add your subscription logic here
    console.log('User subscribed!');
    this.isPopupVisible = false; // Close the popup after subscribing
  }
}
