import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { ScrollService } from '../core/services/scroll.service';
import { SECTION_IDS, HEADER_OFFSET_PX } from '../core/constants/layout.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly sectionIds = SECTION_IDS;
  translations: any;
  currentLanguage = 'ka';

  // Footer legal row (ka.json footer.legal): off until Privacy / Terms / Cookie pages exist.
  // privacy — კონფიდენციალურობის პოლიტიკა
  // terms — მომსახურების პირობები
  // cookies — ქუქიების პოლიტიკა
  showLegalFooterLinks = false;

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
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

  /** Same behavior as header: scroll on homepage; navigate home first if on another route. */
  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const currentUrl = this.router.url.split('?')[0].replace(/\/$/, '') || '/';
    const isOnBookingPage = currentUrl.includes('/booking');
    const isOnHomepage = currentUrl === '/en' || currentUrl === '/ka';

    if (isOnBookingPage || !isOnHomepage) {
      this.router.navigate([`/${this.currentLanguage}`]).then(() => {
        setTimeout(() => this.scrollToSectionOnHomepage(sectionId), 100);
      });
    } else {
      this.scrollToSectionOnHomepage(sectionId);
    }
  }

  private scrollToSectionOnHomepage(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetY = sectionId === SECTION_IDS.HOME ? 0 : element.offsetTop - HEADER_OFFSET_PX;
      this.scrollService.smoothScrollTo(targetY, { duration: 800 });
    }
  }

}
