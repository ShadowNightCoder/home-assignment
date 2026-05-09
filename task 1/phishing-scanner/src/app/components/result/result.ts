import { Component, Input } from '@angular/core';
import { ScanResult } from '../../service/scanner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  // its a child component so i use angular inout to pass down the result
  @Input() result: ScanResult | null = null;
  @Input() fileName: string = '';
}
