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
  scannerService = inject(ScannerService); //i use inject to bring my service of the regex 
  cdr = inject(ChangeDetectorRef);

  // its the current state of my UI
  scanResult: ScanResult | null = null;
  fileName: string = '';

  // when a file was entred this function is being triggered
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    // make sure the user actually selected a file and ensure the file is strictly a .txt file
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        alert('Please upload a .txt file only.');
        input.value = '';
        return;
      }

      this.fileName = file.name;
      this.scanResult = null;

      // its call the service to scan the file and return the result
      this.scannerService.scanFile(file).subscribe({
        next: (result) => {
          this.scanResult = result;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          // clear the input field so the user can upload another file if they want to
          input.value = '';
        }
      });
    }
  }
}