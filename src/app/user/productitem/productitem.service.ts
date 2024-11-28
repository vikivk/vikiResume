import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductitemService {



  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {

  }
  productDisplay() {
    return this.http.get(`${this.apiUrl}/productDisplay`);
  }
  typeDisplay() {
    return this.http.get(`${this.apiUrl}/typeDisplay`);
  }
  particularDisplay(productIds: string[]): Observable<any> {
    const ids = productIds.join(',');
    return this.http.get(`${this.apiUrl}/productParticular?ids=${ids}`);
  }

 

  orderSubmit(data: any) {
    return this.http.post(`${this.apiUrl}/orderSubmit`, data);
  }
}
