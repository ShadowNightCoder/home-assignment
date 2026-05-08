import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 

export interface ScanResult {
  isPhishing: boolean;
  indicators: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  
  scanFile(file: File): Observable<ScanResult> {
    return new Observable((observer) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        observer.next(this.analyzeContent(content));
        observer.complete(); 
      };
      
      reader.onerror = () => observer.error('Error reading file');
      reader.readAsText(file);
    });
  }

  private analyzeContent(text: string): ScanResult {
    const indicators: string[] = [];
    
    const ipUrlRegex = /https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i;
    if (ipUrlRegex.test(text)) {
      indicators.push('Suspicious Link: IP address used instead of a domain name.');
    }

    const spoofedEmailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z]*[0-9][a-zA-Z]*\.[a-zA-Z]{2,}/i;
    if (spoofedEmailRegex.test(text)) {
      indicators.push('Spoofed Sender: Numbers detected in the domain name (e.g., paypa1.com).');
    }

    const urgentLangRegex = /\b(urgent|immediately|action required|account suspended|verify your account)\b/i;
    if (urgentLangRegex.test(text)) {
      indicators.push('Urgent Language: High-pressure or manipulative words detected.');
    }

    return {
      isPhishing: indicators.length > 0,
      indicators: indicators
    };
  }
}