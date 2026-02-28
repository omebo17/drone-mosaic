import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  translations: any;
  currentLanguage: string = 'en';

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.currentLanguage = this.languageService.currentLanguage;

    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => {
      this.translations = translations;
    });

    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToBooking(): void {
    this.router.navigate([`/${this.currentLanguage}/booking`]);
  }
}
