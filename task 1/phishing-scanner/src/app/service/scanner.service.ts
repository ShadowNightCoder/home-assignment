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
  
  // takes a file as object and retrn stream of data (observable) that containing the scanResult
  scanFile(file: File): Observable<ScanResult> {
    return new Observable((observer) => {
      const reader = new FileReader();
      
      // What to do when the file finishes loading (its take the text out run over it with function and send the result back)
      reader.onload = (e) => {
        const content = e.target?.result as string;
        observer.next(this.analyzeContent(content));
        observer.complete(); 
      };
      
      reader.onerror = () => observer.error('Error reading file');
      reader.readAsText(file);
    });
  }

  // this is my regex function, its checks the text against our phishing rules
  private analyzeContent(text: string): ScanResult {
    const indicators: string[] = [];
    
    // REGEX 1: Looks for "http://" followed by an IP address (e.g., 192.168.1.1)
    const ipUrlRegex = /https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i;
    if (ipUrlRegex.test(text)) {
      indicators.push('Suspicious Link: IP address used instead of a domain name.');
    }

    // REGEX 2: Looks for emails where the domain contains a number (e.g., support@paypa1.com)
    const spoofedEmailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z]*[0-9][a-zA-Z]*\.[a-zA-Z]{2,}/i;
    if (spoofedEmailRegex.test(text)) {
      indicators.push('Spoofed Sender: Numbers detected in the domain name (e.g., paypa1.com).');
    }

    // REGEX 3: Looks for specific manipulative keywords
    const urgentLangRegex = /\b(urgent|immediately|action required|account suspended|verify your account)\b/i;
    if (urgentLangRegex.test(text)) {
      indicators.push('Urgent Language: High-pressure or manipulative words detected.');
    }

    return {
      isPhishing: indicators.length > 0, // its return true if it found at least 1 indicator
      indicators: indicators
    };
  }
}