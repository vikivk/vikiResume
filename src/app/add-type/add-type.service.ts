import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddTypeService {

  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {
    
  }

  TypeCreate(data: any) {
    return this.http.post(`${this.apiUrl}/TypeCreate`, data);
  }
  typeDisplay(){
      return this.http.get(`${this.apiUrl}/typeDisplay`);      
  }
  typeUpdate(id: number, data: any) {
    return this.http.post(`${this.apiUrl}/typeUpdate/${id}`, data); 
  }
  typeDelete(typeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/typeDelete/${typeId}`);
}
}
