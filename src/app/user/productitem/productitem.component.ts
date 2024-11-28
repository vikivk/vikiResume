import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductitemService } from './productitem.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-productitem',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, ReactiveFormsModule,FormsModule],
  providers: [ProductitemService],
  templateUrl: './productitem.component.html',
  styleUrls: ['./productitem.component.css']
})
export class ProductitemComponent {
  isNavVisible = false;
  products: any[] = [];
  productGroups: { [key: string]: any[] } = {};
  qtyForm: { [key: string]: FormGroup } = {}; // Form groups for each product
  totalAmounts: { [key: string]: number } = {}; // Store total amount for each product
  overallTotal: number = 0;
  productCount: number = 0; // Store the number of products with valid quantities
  showAddToCart: { [key: string]: boolean } = {};
  isModalOpen = false;
  selectedProducts: any[] = [];
  productIdsWithQty: string[] = [];
  AddToCart: any[] = [];
  afterDiscountedPrice: number[] = [];
  qtyForProducts: { [key: string]: number } = {};  // Declare qtyForProducts as an object to store product IDs and quantities
  isAlertVisible = false; 
  showLogoSection: boolean = false;
  cartUpdated: boolean = false;
  districts: string[] = [];
  selectedState: string = '';
  selectedValue: string = '0';
  // estimateTotals: { id: number, estimateTol: number }[] = [];
  // orderForm: FormGroup;
  // orderSubmit = {
  //   productId: '',
  //   productName: '',
  //   // Any other fields you want to capture from the form
  // };
  cartForm:FormGroup;
  patchedCartItems: any[] = [];
  constructor(
    private productitemService: ProductitemService,
    private fb: FormBuilder
  ) {

    // this.orderForm = this.fb.group({
    //   // productId: ['', Validators.required],
    //   // qty: ['', Validators.required],
    //   state: ['', Validators.required],
    //   district: ['', Validators.required],
    //   name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   mobile: ['', Validators.required],
    //   address: ['', Validators.required]
    // });
    this.cartForm = this.fb.group({
      state: ['', Validators.required],
      district: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', Validators.required],
      // Add other form controls here as needed
    });
    // this.addCartItemsToForm();
    // this.cartForm=this.fb.group({
    //   productId: [''],
    //   qty: [''],
    //   discountedPrice:  [''],
    //   productName:  ['']
    // });
    
    
  }

  ngOnInit(): void {
    this.productDisplay();
    

  }

  toggleNav() {
    this.isNavVisible = !this.isNavVisible;
  }

  productDisplay() {
    this.productitemService.productDisplay().subscribe(
      (productData: any) => {
        this.productitemService.typeDisplay().subscribe(
          (typeData: any) => {
            this.products = this.mergeProductAndTypeData(productData, typeData);
            this.groupProductsByType();
            this.initializeForms();
          },
          (error) => {
            console.error('Error fetching type data:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }
  // addCartItemsToForm() {
  //   this.AddToCart.forEach(cartItem => {
  //     this.orderForm.addControl(`productId_${cartItem.productId}`, this.fb.control(cartItem.productId, Validators.required));
  //     this.orderForm.addControl(`qty_${cartItem.productId}`, this.fb.control(cartItem.qty, Validators.required));
      
  //   });
  // }
  

  mergeProductAndTypeData(productData: any[], typeData: any[]): any[] {
    return productData.map(product => {
      const typeDetails = typeData.find(type => type.productType === product.productType);
      return {
        ...product,
        ...typeDetails
      };
    });
  }

  // Group products by type
  groupProductsByType() {
    this.productGroups = this.products.reduce((grouped: any, product: any) => {
      const type = product.productType;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(product);
      return grouped;
    }, {});
    console.log("productGroups", this.productGroups)
  }

  // Initialize form controls for each product
  initializeForms() {
    this.products.forEach(product => {
      this.qtyForm[product.productId] = this.fb.group({
        qty: ['']
      });

      // Subscribe to changes
      // this.qtyForm[product.productId].get('qty')?.valueChanges.subscribe(() => {
      //   this.onQuantityChange(product.productId);
      //   const qty = parseInt(value, 10);
      //   this.showAddToCart[product.productId] = qty > 0;
      // });
      this.qtyForm[product.productId].get('qty')?.valueChanges.subscribe(value => {
        this.onQuantityChange(product.productId);
        const qty = parseInt(value, 10);
        this.showAddToCart[product.productId] = qty > 0;
      });
    });

  }
  openModal(product: any) {
    const selectedQty = this.qtyForm[product.productId].get('qty')?.value || 0;
    console.log(selectedQty)
    // Check if the product is already in the selectedProducts array
    const existingProductIndex = this.selectedProducts.findIndex(p => p.productId === product.productId);
    console.log("existingProductIndex", existingProductIndex)
    if (existingProductIndex !== -1) {
      // If the product is already selected, update its quantity
      this.selectedProducts[existingProductIndex].qty = selectedQty;
    } else {
      // If the product is not yet selected, add it to the array
      this.selectedProducts.push({
        ...product,
        qty: selectedQty
      });
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    // this.showLogoSection = false;
  }
  goBackToEstimate() {
    this.showLogoSection = false; // Switch back to the first section
  }
  onQuantityChange(productId: string) {
    const form = this.qtyForm[productId];
    const qty = parseFloat(form.get('qty')?.value) || 0; // Ensure qty is a number
    const product = this.products.find(p => p.productId === productId);

    // Debugging logs
    // console.log(`qty: ${qty}`);
    // console.log(`product: `, product);

    if (product) {
      const discountedPrice = this.calculateDiscountedPrice(product);
     console.log(`Discounted price: ${discountedPrice}`);

      if (isNaN(discountedPrice) || isNaN(qty)) {
       // console.error('Discounted Price or Quantity is not a number.');
        return; // Exit the function if discounted price or qty is not a number
      }

      // Calculate total amount for this product
      this.totalAmounts[productId] = qty * discountedPrice;
      console.log(`Total amount for product ${productId}: ${this.totalAmounts[productId]}`);

      // Recalculate the number of products with a valid quantity
      this.calculateProductCount();

      // Update the overall total
      this.calculateOverallTotal();

    }
  }

  calculateProductCount() {
    // Clear the array each time you calculate the product count
    this.productIdsWithQty = [];  // Reset the array to avoid stale data
    this.qtyForProducts = {};     // Object to store product IDs with their corresponding quantities

    this.productCount = Object.keys(this.qtyForm).filter(productId => {
      const qty = parseFloat(this.qtyForm[productId].get('qty')?.value) || 0;

      if (qty > 0) {
        this.productIdsWithQty.push(productId);  // Store the product ID if quantity is greater than zero
        this.qtyForProducts[productId] = qty;    // Store the quantity for this product
        return true;
      }

      return false;
    }).length;

    console.log(`Number of products with quantity entered: ${this.productCount}`);
    console.log('Product IDs with quantities:', this.productIdsWithQty);
    console.log('Quantities for products:', this.qtyForProducts);

    // Now pass the product IDs and their quantities to addToCart
    this.addToCart(this.productIdsWithQty, this.qtyForProducts);
  }
  addToCart(productIds: string[], qtyForProducts: any) {
    if (productIds.length > 0) {
        this.AddToCart = [];  // Clear the cart first
        this.cartUpdated = false;  // Reset the flag

        // Call the service to fetch product details for the given product IDs
        this.productitemService.particularDisplay(productIds).subscribe(
            response => {
                if (response && response.products && Array.isArray(response.products)) {
                    response.products.forEach((product: any) => {
                        // Calculate discounted price for each product
                        const discountedPrice = this.estimatePrice(product)
//console.log(discountedPrice);
const estimateTol = this.estimateTotal(product);


                        // Add quantity and discounted price to the product details
                        const productWithQtyAndDiscount = {
                            ...product,  // Spread the product details
                            qty: qtyForProducts[product.productId], 
                            discountedPrice: discountedPrice, 
                            estimateTol: estimateTol 
                            // Set discounted price or null
                        };

                        // Push the product with quantity and discounted price to AddToCart
                        this.AddToCart.push(productWithQtyAndDiscount);
                    });
//this.patchCartItems();
                    // Mark the cart as updated
                    this.cartUpdated = true;

                    console.log('Updated AddToCart with quantities and discounted prices:', this.AddToCart);
                } else {
                    console.error('Expected a response with a products array but got:', response);
                }
            },
            error => {
                console.error('Error adding products to cart:', error);
            }
        );
    } else {
        console.warn('No products selected to add to cart.');
    }
}

                 

  // Add this method to your ProductitemComponent class
  calculateOverallTotal(): number {
    const overallTotal = Object.values(this.totalAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
   //console.log(`Overall Total: ₹ ${overallTotal}`);
    this.overallTotal = overallTotal; // Update the overallTotal
    return overallTotal; // Return the calculated total
}


  // In your component file (e.g., your-component.ts)
  calculateDiscountedPrice(product: any): number {
    const originalPrice = product.price || 0; // Original price
    const discount = product.discount || 0; // Discount amount

    // Calculate the total amount after applying the discount
   // const tolAmount = originalPrice - discount;
    const discountAmount = (originalPrice * discount) / 100;
    const discountedPrice = originalPrice - discountAmount;
    // Calculate the discount percentage
    //const discountPercentage = (discount / originalPrice) * 100;
   // console.log(`Discounted Price for product ID ${product.productId}: ${discountedPrice}`);
    // Logging the discount percentage
    // console.log(`Discount Percentage: ${discountPercentage}%`);
    
    // Logging the discounted price
    //console.log(`Discounted Price: ${discountedPrice}`);
    // this.afterDiscountedPrice[product.productId] = discountedPrice;
//console.log("after",this.afterDiscountedPrice)
    return discountedPrice;
}

  estimatePrice(product: any): number {
    const originalPrice = product.price || 0; // Original price
    const discount = product.typeDetails.discount || 0;
//console.log(discount)
    // Calculate the total amount after applying the discount
   // const tolAmount = originalPrice - discount;
    const discountAmount = (originalPrice * discount) / 100;

    const discountedPrice = originalPrice - discountAmount;
  // console.log(discountedPrice)
    // Discount

    return discountedPrice;
  }
  estimateTotal(product: any): number {
    const originalPrice = product.price || 0; // Original price
    const discount = product.typeDetails.discount || 0;
     //console.log("og",originalPrice)
    // console.log("dist",discount)
     const discountAmount = (originalPrice * discount) / 100;

     const discountedPrice = originalPrice - discountAmount;
    // const tolAmount = originalPrice - discount;
    // console.log("amt",tolAmount)
    const qty = product.qty;
    const estimateTol = qty * discountedPrice
    // this.estimateTotals.push({
    //   id: product.id,
    //   estimateTol: estimateTol
    // });
    // console.log(this.estimateTotals)
    return estimateTol;
  }
  // calculateDiscountedPric(product: any): number {
  //   const originalPrice = parseFloat(product.price) || 0; // Parse the original price
  //   const discount = parseFloat(product.discount) || 0; // Parse the discount
  //   return originalPrice - discount; // Final price after discount
  // }



  // productitem.component.ts

  // In your productitem.component.ts

  // calculateTotalDiscount(products: any[]): number {
  //   return products.reduce((total, product) => {
  //     // Check if the product has a discount value and is a valid number
  //     const discount = product.discount || 0;
     
  //     return discount;
  //   });
  // }


  // Get image source for product image
  getImageSrc(base64Image: string): string {
    if (base64Image) {
      const formattedBase64Image = base64Image.replace('dataimage/jpegbase64/', ''); // Remove incorrect prefix
      return `data:image/jpeg;base64,/${formattedBase64Image}`;
    }
    return 'placeholder.jpg'; // Provide a placeholder if there's no image
  }

  //modal state
  states = [
    { name: 'Andra Pradesh', districts: ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Prakasam", "Nellore", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"], value: '5000' },
    { name: 'Karnataka', districts: ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary", "Bidar", "Vijayapura", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Gulbarga", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Yadgir"], value: '5000' },
    { name: 'Tamil Nadu', districts: ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"], value: '4000' },
    { name: 'Telangana', districts: ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar", "Jogulamba", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"], value: '5000' },
    { name: 'Pondicherry', districts: ["Karaikal", "Mahe", "Puducherry", "Yanam"], value: '5000' }
  ];
  onStateChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Type assertion here
    const state = target.value;

    const selected = this.states.find(s => s.name === state);
    this.districts = selected ? selected.districts : [];
    this.selectedState = selected ? selected.name : '';
    this.selectedValue = selected ? selected.value : '';
  }


  // submitOrder() {
  //   if (this.orderForm.valid) {
  //     const orderData = this.orderForm.value;
  //     console.log(orderData)
  //     // this.http.post('/orderSubmit', orderData).subscribe(
  //     //   response => {
  //     //     console.log('Order placed successfully:', response);
  //     //     // Handle success scenario
  //     //   },
  //     //   error => {
  //     //     console.error('Error placing order:', error);
  //     //     // Handle error scenario
  //     //   }
  //     // );
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
//   onSubmit(orderSubmit: NgForm) {
   
//     console.log('Form submitted:', orderSubmit.value);
//     console.log('Product ID:', orderSubmit.value.productId);
// console.log('Product Name:', orderSubmit.value.productName);

//     // You can send the form data to a server or use it in other logic
//   }
submitOrder() {
  if (this.cartForm.valid && this.AddToCart.length > 0) {
    // Extract only the required fields from AddToCart
    const orderDetails = this.AddToCart.map(item => ({
      discountedPrice: item.discountedPrice,
      price: item.price,
      productId: item.productId,
      qty: item.qty,
      stock: item.stock,
      productName:item.productName,
      totalPrice:item.totalPrice,
      overallTotal:item.overallTotal
    }));

    // Generate invoice number based on current date
    const invoiceNumber = this.generateInvoiceNumber();
    const currentDate = new Date().toISOString().split('T')[0];
    // Combine cartForm values and orderDetails into a single object
    const combinedData = {
      ...this.cartForm.value,  // Spread the current form data
      invoiceNumber: invoiceNumber,  // Add the generated invoice number
      orderItems: orderDetails,
      orderDate: currentDate     // Add the order items
    };
console.log(combinedData)

    // Send combined data to backend using POST method
    this.productitemService.orderSubmit(combinedData).subscribe(
      (response) => {
        console.log('Combined Data:', combinedData);
        console.log('Order successfully submitted:', response);
        
        // Clear the form and cart data after submission
        this.cartForm.reset();
        this.AddToCart = [];
        // this.overallTotal=0;
        // this.productCount=0;
        // this.qtyForm={};
        this.isAlertVisible = true;
        setTimeout(() => {
          this.isAlertVisible = false;
          window.location.reload();
        }, 3000);
      
        // Optionally, call a method to refresh or update the order list/display
        
      },
      (error) => {
        console.error('Error submitting order:', error);
      }
    );
  } else {
    console.log('Form is invalid or AddToCart array is empty');
  }
}



// Function to generate invoice number based on current date
generateInvoiceNumber(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2); // Last two digits of the year
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month (01-12)
  const day = String(currentDate.getDate()).padStart(2, '0'); // Day (01-31)
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999

  return `inv${year}${month}${day}${randomNum}`; // Example format: INV-240918-1234
}



  // patchCartItems() {
  //   // Log the current AddToCart array to understand its structure
  //   console.log('Current AddToCart:', this.AddToCart);
  
  //   // Check if the AddToCart array is not empty
  //   if (this.AddToCart.length === 0) {
  //     console.error('The AddToCart array is empty.');
  //     return;
  //   }
  
  //   // Clear previous patched items
  //   this.patchedCartItems = [];
  
  //   // Creating an array of details from AddToCart
  //   const details = this.AddToCart.map((item: any) => ({
  //     productId: item.productId,                // Correctly access item properties
  //     qty: item.qty,
  //     discountedPrice: item.discountedPrice,
  //     productName: item.productName
  //   }));
  
  //   details.forEach((item, index) => {
  //     console.log(`Patching item at index ${index}:`, {
  //       productId: item?.productId,
  //       discountedPrice: item?.discountedPrice,
  //       productName: item?.productName
  //     });
  
  //     // Patch the form with each item
  //     this.cartForm.patchValue({
  //       productId: item?.productId,
  //       discountedPrice: item?.discountedPrice,
  //       productName: item?.productName
  //       // Add more fields if needed
  //     });
  
  //     // After patching, store the form values into patchedCartItems array
  //     this.patchedCartItems.push(this.cartForm.value);
  //   });
  
  //   // Log the form controls after patching
  //   //console.log('Form After Patching:', this.cartForm.value);
  //  // console.log('Patched Cart Items:', this.patchedCartItems);
 // }
}
