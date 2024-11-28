import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {
    
  }

  stockDisplay(){
    return this.http.get(`${this.apiUrl}/productDisplay`);      
}

}