import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

interface Stock {
  productId: number;
  productName: string;
  productType: string;
  stock: number;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  stockDisplay(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/productDisplay`);      
  
  }
}
