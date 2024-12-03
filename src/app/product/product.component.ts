import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './product.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [ProductService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products: any[] = [];
  selectedProduct: any; // To store the product being edited
  isAlertVisible = false; // Control alert visibility
  // imageBlob: Blob | null = null; 
  selectedFiles: File[] = [];
  selectedImages: any = [];
  image: any;
  constructor(private ProductService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productDisplay();
  }

  // Initialize the form
  addproduct = new FormGroup({
    productName: new FormControl('', Validators.required),
    productType: new FormControl('', Validators.required),
    stock: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    image: new FormControl(null),
  });
  //     onFileChange(event: Event) {
  //       const input = event.target as HTMLInputElement;

  //       if (input.files && input.files.length > 0) {
  //           const file = input.files[0];
  //           this.convertToBlob(file);
  //       }
  //   }
  //   convertToBlob(file: File) {
  //     const reader = new FileReader();

  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //         // Create a Blob from the file content
  //         this.imageBlob = new Blob([e.target?.result as ArrayBuffer], { type: file.type });
  //         console.log('Image converted to Blob:', this.imageBlob);
  //     };

  //     reader.onerror = (error) => {
  //         console.error('Error reading file:', error);
  //     };

  //     // Read the file as ArrayBuffer
  //     reader.readAsArrayBuffer(file);
  // }

  onFileChange(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      reader.onload = () => {
        const uploadedImage = reader.result as string;
        this.image = uploadedImage;
        console.log(this.image);
      };
      reader.readAsDataURL(file);
      this.selectedFiles.push(file);
      this.selectedImages.push(this.image)
    }
  }
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const uploadedImage = reader.result;
      this.image = uploadedImage;
     // console.log(this.image);
    };
    reader.readAsDataURL(file);
  }
  // blop end











  resetForm() {
    this.addproduct.reset();
    this.selectedProduct = null; // Clear selected product if any
  }

  // Method to open the edit modal and populate fields with selected product data
  editProduct(product: any) {
    this.selectedProduct = product;
    this.addproduct.patchValue({
      productName: product.productName,
      productType: product.productType,
      stock: product.stock,
      price: product.price,
      image: product.image
    });
  }

  onSubmit(isEdit: boolean) {
    if (this.addproduct.valid) {
      const productData: any = this.addproduct.value; // Use 'any' type here to allow for 'image'

      if (isEdit) {
        // Update product
        this.ProductService.productUpdate(this.selectedProduct.productId, productData).subscribe(
          (response) => {
            this.productDisplay(); // Refresh product list after update
            this.addproduct.reset();
            this.selectedProduct = null; // Clear selected product
            console.log('Product updated successfully:', response);
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        // Create a new product
        productData.image = this.image; // Assign the Blob to image property
        console.log(productData.image)
        console.log(productData)
        this.ProductService.productCreate(productData).subscribe(
          (response) => {

            this.productDisplay(); // Refresh product list after creation
            this.addproduct.reset();
            console.log('Product created successfully:', response);
          },
          (error) => {
            console.error('Error creating product:', error);
          }
        );
      }
    } else {
      console.log("Form not valid");
    }
  }


  // Fetch and display products
  productDisplay() {
    this.ProductService.productDisplay().subscribe(
      (data: any) => {
        this.products = data;
        console.log(this.products)
        // Assuming the API returns an array of products
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }
  getImageSrc(base64Image: string): string {
    // Check if the base64Image starts with the incorrect prefix and fix it
    if (base64Image) {
      // Replace the incorrect prefix with the correct one
      const formattedBase64Image = base64Image.replace('dataimage/jpegbase64/', ''); // Remove incorrect prefix
      return `data:image/jpeg;base64,/${formattedBase64Image}`;
    }
    return 'placeholder.jpg'; // Provide a placeholder if there's no image
  }

  deleteModal(productId: number) {
    console.log('Deleting product with ID:', productId); // Check productId
    this.ProductService.productDelete(productId).subscribe(
      (response) => {
        this.productDisplay();
        console.log('Product deleted successfully:', response);
        // Show the alert after successful deletion
        this.isAlertVisible = true;
        setTimeout(() => {
          this.isAlertVisible = false;
        }, 3000);
      },
      (error) => {
        console.error('Error deleting product:', error); // Log the error details
      }
    );
  }




  // Uncomment to handle product deletion
  // deleteProduct(productId: number) {
  //   this.ProductService.deleteProduct(productId).subscribe(
  //     (response) => {
  //       console.log('Product deleted successfully:', response);
  //       this.productDisplay(); // Refresh product list after deletion
  //     },
  //     (error) => {
  //       console.error('Error deleting product:', error);
  //     }
  //   );
  // }
  // TypeScript code to handle the alert display and button actions



}
