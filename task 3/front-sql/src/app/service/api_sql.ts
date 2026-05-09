import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class LoginService {
  // define the base URL of my Node.js/Express backend
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // sends a POST request to the vulnerable endpoint with the user's input
  loginVulnerable(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login-vulnerable`, credentials);
  }

  // sends a POST request to the secure endpoint with the user's input
  loginSecure(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login-secure`, credentials);
  }
}