import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Fetch all orders
  orderDisplay(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orderDisplay`);
  }
  orderStatus(data: any) {
    return this.http.post(`${this.apiUrl}/updateOrderStatus`, data);
  }
  orderSubmit(data: any) {
    return this.http.post(`${this.apiUrl}/addOrder`, data);
  }
}
