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
  vulnerableUser = { username: '', password: '' };
  secureUser = { username: '', password: '' };

  // Status variables
  vMessage: string = '';
  vIsSuccess: boolean | null = null;

  sMessage: string = '';
  sIsSuccess: boolean | null = null;

  constructor(
    private loginService: LoginService, 
    private cdr: ChangeDetectorRef // Injected correctly
  ) {}

  testVulnerable() {
    this.loginService.loginVulnerable(this.vulnerableUser).subscribe({
      next: (res) => {
        this.vMessage = res.message;
        this.vIsSuccess = true;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        this.vMessage = err.error?.message || 'Login Failed';
        this.vIsSuccess = false;
        this.cdr.detectChanges(); // Force UI update
      }
    });
  }

  testSecure() {
    this.loginService.loginSecure(this.secureUser).subscribe({
      next: (res) => {
        this.sMessage = res.message;
        this.sIsSuccess = true;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        this.sMessage = err.error?.message || 'Access Denied';
        this.sIsSuccess = false;
        this.cdr.detectChanges(); // Force UI update
      }
    });
  }
}