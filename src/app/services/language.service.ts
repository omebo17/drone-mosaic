import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject: BehaviorSubject<string>;
  public currentLanguage$: Observable<string>;
  
  private translationsSubject: BehaviorSubject<any>;
  public translations$: Observable<any>;
  
  private translations: any = {};

  constructor(private http: HttpClient) {
    // Get language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    this.currentLanguageSubject = new BehaviorSubject<string>(savedLang);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
    
    this.translationsSubject = new BehaviorSubject<any>({});
    this.translations$ = this.translationsSubject.asObservable();
    
    // Load initial translations
    this.loadTranslations(savedLang);
  }

  get currentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: string): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('preferred-language', lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string): void {
    this.http.get(`/assets/i18n/${lang}.json`).subscribe({
      next: (translations) => {
        this.translations = translations;
        this.translationsSubject.next(translations);
      },
      error: (error) => {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English if translation loading fails
        if (lang !== 'en') {
          this.loadTranslations('en');
        }
      }
    });
  }

  getTranslation(key: string): string {
    const keys = key.split('.');
    let result = this.translations;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return result;
  }

  getTranslations(): any {
    return this.translations;
  }

  getLanguageCode(lang: string): string {
    return lang === 'ge' ? 'ka' : 'en';
  }

  getLanguageFromCode(code: string): string {
    return code === 'ka' ? 'ge' : 'en';
  }
}

