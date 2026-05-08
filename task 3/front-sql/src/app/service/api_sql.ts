import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class LoginService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  loginVulnerable(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login-vulnerable`, credentials);
  }

  loginSecure(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login-secure`, credentials);
  }
}