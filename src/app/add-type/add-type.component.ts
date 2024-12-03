import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AddTypeService } from './add-type.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-type',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [AddTypeService],
  templateUrl: './add-type.component.html',
  styleUrl: './add-type.component.css'
})
export class AddTypeComponent {

  products: any[] = [];
  selectedProduct: any; // To store the product being edited
  isAlertVisible = false; // Control alert visibility


  constructor(private AddTypeService: AddTypeService, private router: Router) { }

  ngOnInit(): void {
    this.TypeproductDisplay();
  }

  // Initialize the form
  addproductType = new FormGroup({

    productType: new FormControl('', Validators.required),
    discount: new FormControl(0),
    location: new FormControl(''),
    pack: new FormControl('', Validators.required),
    supplier: new FormControl(''),

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



  // blop end











  resetForm() {
    this.addproductType.reset();
    this.selectedProduct = null; // Clear selected product if any
  }

  // Method to open the edit modal and populate fields with selected product data
  editProduct(product: any) {
    this.selectedProduct = product;
    this.addproductType.patchValue({

      productType: product.productType,
      discount: product.discount,
      location: product.location,
      supplier: product.supplier,
      pack: product.pack
    });
    console.log(this.addproductType)
  }

  onSubmit(isEdit: boolean) {
    const productData: any = this.addproductType.value;

    // console.log(productData)
    if (this.addproductType.valid) {


      if (isEdit) {
        // Update product
        this.AddTypeService.typeUpdate(this.selectedProduct.typeId, productData).subscribe(
          (response) => {
            this.TypeproductDisplay(); // Refresh product list after update
            this.addproductType.reset();
            this.selectedProduct = null; // Clear selected product
            console.log('Product type updated successfully:', response);
          },
          (error) => {
            console.error('Error updating product type:', error);
          }
        );
      } else {
        // Create a new product


        this.AddTypeService.TypeCreate(productData).subscribe(
          (response) => {
            console.log(productData)
            this.TypeproductDisplay(); // Refresh product list after creation
            this.addproductType.reset();
            console.log('Product type created successfully:', response);
          },
          (error) => {
            console.error('Error creating product type:', error);
          }
        );
      }
    } else {

      console.log("Form not valid");
    }
  }


  // Fetch and display products
  TypeproductDisplay() {
    this.AddTypeService.typeDisplay().subscribe(
      (data: any) => {
        this.products = data;
        // console.log(this.products)
        // Assuming the API returns an array of products
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }


  deleteModal(typeId: number) {
    console.log('Deleting product with ID:', typeId); // Check productId
    this.AddTypeService.typeDelete(typeId).subscribe(
      (response) => {
        this.TypeproductDisplay();
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
  //   this.AddTypeService.deleteProduct(productId).subscribe(
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
