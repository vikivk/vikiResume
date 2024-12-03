
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';


@Injectable({
  providedIn: 'root',
})
export class AdminLoginService {
 
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  adminLogin(data: any) {
    return this.http.post(`${this.apiUrl}/createUser`, data);
  }
  logincheck(data:any){
    return this.http.post(`${this.apiUrl}/loginCheck`, data);
  }
}


