import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ScannerService, ScanResult } from '../../service/scanner.service';
import { Result } from '../result/result';

@Component({
  selector: 'app-main',
  imports: [CommonModule, Result],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
scannerService = inject(ScannerService);
  cdr = inject(ChangeDetectorRef);
  scanResult: ScanResult | null = null;
  fileName: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        alert('Please upload a .txt file only.');
        input.value = '';
        return;
      }

      this.fileName = file.name;
      this.scanResult = null; 
      
      this.scannerService.scanFile(file).subscribe({
        next: (result) => {
          this.scanResult = result;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          input.value = ''; 
        }
      });
    }
  }
}