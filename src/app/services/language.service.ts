import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject: BehaviorSubject<string>;
  public currentLanguage$: Observable<string>;

  constructor() {
    // Get language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLang);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }

  get currentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: string): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('preferred-language', lang);
  }

  getLanguageCode(lang: string): string {
    return lang === 'ge' ? 'ka' : 'en';
  }

  getLanguageFromCode(code: string): string {
    return code === 'ka' ? 'ge' : 'en';
  }
}

