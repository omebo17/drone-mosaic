import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {
  translations: any;
  currentLanguage: string = 'en';

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Always scroll to top when page loads
    window.scrollTo(0, 0);

    // Get current language
    this.currentLanguage = this.languageService.currentLanguage;

    // Get translations directly
    this.translations = this.languageService.getTranslations();

    // Subscribe to translations changes
    this.languageService.translations$.subscribe(translations => {
      this.translations = translations;
    });

    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  navigateToBooking(): void {
    this.router.navigate([`/${this.currentLanguage}/booking`]);
  }
}
