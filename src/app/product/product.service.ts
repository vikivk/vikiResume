import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {
    
  }

  productCreate(data: any) {
    return this.http.post(`${this.apiUrl}/productCreate`, data);
  }
  productDisplay(){
      return this.http.get(`${this.apiUrl}/productDisplay`);      
  }
  productUpdate(id: number, data: any) {
    return this.http.post(`${this.apiUrl}/productUpdate/${id}`, data); 
  }
  productDelete(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productDelete/${productId}`);
}
  
}
