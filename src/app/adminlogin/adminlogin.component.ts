import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AdminLoginService } from './adminlogin.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component'; 
@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule,CommonModule],
  providers: [AdminLoginService],
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {
  loginSuccessMessage: string | null = null;
  loginErrorMessage: string | null = null;
  signupSuccessMessage: string | null = null;
  signupErrorMessage: string | null = null;

  constructor(private adminLoginService: AdminLoginService, private router: Router) { }


  // Create a FormGroup for the sign-up form
  adminregis = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', Validators.required)
  });

  // Method to handle sign-up form submission
  onSignUp() {
    if (this.adminregis.valid) {
      const userData = this.adminregis.value; // Get form data
      this.adminLoginService.adminLogin(userData).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          this.signupSuccessMessage = 'User created successfully';
          this.signupErrorMessage = null;
          this.adminregis.reset(); // Reset the form after successful submission

          // Hide success message after 3 seconds
          setTimeout(() => {
            this.signupSuccessMessage = null;
          }, 3000);
           
        },
        (error) => {
          console.error('Error creating user:', error);
          this.signupErrorMessage = 'Error creating user';
          this.signupSuccessMessage = null;

          // Hide error message after 3 seconds
          setTimeout(() => {
            this.signupErrorMessage = null;
          }, 3000);
        }
      );
    } else {
      this.signupErrorMessage = 'Form is not valid';
    }
  }

  loginCheck = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  // Method to handle sign-in form submission
  onSignIn() {
    if (this.loginCheck.valid) {
      const loginData = this.loginCheck.value;
      this.adminLoginService.logincheck(loginData).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          this.loginSuccessMessage = 'Login successful';
          this.loginErrorMessage = null;
          this.loginCheck.reset();
  
          // Store the JWT token in sessionStorage
          sessionStorage.setItem('authToken', response.token);
  
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.loginSuccessMessage = null;
          }, 3000);
  
          // Navigate to Dashboard
          this.router.navigate(['/Dashboard']);
        },
        (error) => {
          console.error('Login failed:', error);
          this.loginErrorMessage = 'Login failed';
          this.loginSuccessMessage = null;
  
          // Hide error message after 3 seconds
          setTimeout(() => {
            this.loginErrorMessage = null;
          }, 3000);
        }
      );
    } else {
      this.loginErrorMessage = 'Form is not valid';
    }
  }
  
  

  // Method to switch to the sign-up form
  toggleSignUp() {
    const container = document.getElementById('container') as HTMLElement;
    if (container) {
      container.classList.add('right-panel-active'); // Add class to show sign-up form
    }
  }

  // Method to switch to the sign-in form
  toggleSignIn() {
    const container = document.getElementById('container') as HTMLElement;
    if (container) {
      container.classList.remove('right-panel-active'); // Remove class to show sign-in form
    }
  }
}
