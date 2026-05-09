import { Component, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../service/api_sql';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [FormsModule, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  // state objects holding the data bound to the HTML input fields
  vulnerableUser = { username: '', password: '' };
  secureUser = { username: '', password: '' };

  // status variables to manage the UI feedback messages
  vMessage: string = '';
  vIsSuccess: boolean | null = null;

  sMessage: string = '';
  sIsSuccess: boolean | null = null;
  
  constructor(
    private loginService: LoginService, 
    private cdr: ChangeDetectorRef // bringing in my API service and ChangeDetectorRef (its recognize changes/updates if angular cant see tham)
  ) {}

  testVulnerable() {
    // send the vulnerableUser object to the backend via the service
    this.loginService.loginVulnerable(this.vulnerableUser).subscribe({
      next: (res) => {
        // HTTP 200 OK: The login (or SQL bypass) was successful
        this.vMessage = res.message;
        this.vIsSuccess = true;
        this.cdr.detectChanges(); // manually tell Angular to redraw the UI
      },
      error: (err) => {
        // HTTP 401/500: The login failed or the server crashed
        this.vMessage = err.error?.message || 'Login Failed';
        this.vIsSuccess = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  testSecure() {
    // send the secureUser object to the backend via the service
    this.loginService.loginSecure(this.secureUser).subscribe({
      next: (res) => {
        this.sMessage = res.message;
        this.sIsSuccess = true;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.sMessage = err.error?.message || 'Access Denied';
        this.sIsSuccess = false;
        this.cdr.detectChanges(); 
      }
    });
  }
}