import { Component, OnInit } from '@angular/core';
import { OrderDetailsService } from './order-details.service';

import { HttpClientModule } from '@angular/common/http';

import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [OrderDetailsService],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orders: any[] = [];
  addOrderForm:FormGroup;
  constructor(private orderDetailsService: OrderDetailsService,private fb: FormBuilder) {
    this.addOrderForm = this.fb.group({
      ProductId: ['', Validators.required],
      ProductName: ['', Validators.required],
      qty: ['', Validators.required],
      price: ['', Validators.required],
      discountedPrice: ['', Validators.required],
      stock: ['', Validators.required],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      state: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.orderDisplay();
    
  }

  orderDisplay(): void {
    this.orderDetailsService.orderDisplay().subscribe(
      (data: any) => {
        this.orders = data;
        console.group(this.orders) // Store the array of orders in the component
      },
      (error) => {
        console.error('Error fetching order data:', error);
      }
    );
  }
  updateStatus(order: any, status: string): void {
    const updatedOrder = { invoiceNumber: order.invoiceNumber, status };

    this.orderDetailsService.orderStatus(updatedOrder).subscribe(
      (response: any) => {
        console.log('Order status updated successfully:', response);
        order.status = status; // Update status in the UI
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
}
onSubmit(): void {
  if (this.addOrderForm.valid) {
    const orderData = this.addOrderForm.value;

    // Generate invoice number (if you want to include this in order data)
    orderData.invoiceNumber = this.generateInvoiceNumber(); // Add this line if needed

    // Add the current date
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    orderData.orderDate = currentDate; // Add current date to the order data

    // Send data to the backend
    this.orderDetailsService.orderSubmit(orderData).subscribe(
      response => {
        console.log('Order submitted successfully', response);
        // Handle success (e.g., show a message to the user, reset the form)
        this.addOrderForm.reset(); // Reset the form if needed
      },
      error => {
        console.error('Error submitting order', error);
        // Handle error (e.g., show an error message to the user)
      }
    );
  } else {
    console.log('Form is invalid');
    // Handle form validation errors (e.g., show a message to the user)
  }
}


generateInvoiceNumber(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month (01-12)
  const day = String(currentDate.getDate()).padStart(2, '0'); // Day (01-31)
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999

  return `inv${year}${month}${day}${randomNum}`; // Example format: INV-240918-1234
}

}
