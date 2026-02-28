import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from '../core/services/language.service';
import { ScrollService } from '../core/services/scroll.service';
import { SECTION_IDS, SCROLL_TO_FORM_OFFSET_PX } from '../core/constants/layout.constants';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  heroImageLoaded = false;
  heroImageLowQuality = 'assets/images/drones-placeholder.png';
  heroImageHighQuality = 'assets/images/drones.png';
  currentHeroImage = this.heroImageLowQuality;
  private static highQualityImageCached = false;

  translations: any = {};
  currentLanguage: string = 'en';

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    // Get current language
    this.currentLanguage = this.languageService.currentLanguage;
    
    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });

    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => {
      this.translations = translations;
    });
    
    // If the high-quality image was already loaded in a previous instance, use it immediately
    if (HomepageComponent.highQualityImageCached) {
      this.currentHeroImage = this.heroImageHighQuality;
      this.heroImageLoaded = true;
    } else {
      this.loadHighQualityImage();
    }
  }

  loadHighQualityImage(): void {
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, switch to high quality
      this.currentHeroImage = this.heroImageHighQuality;
      this.heroImageLoaded = true;
      // Mark as cached so future instances don't reload it
      HomepageComponent.highQualityImageCached = true;
    };
    img.onerror = () => {
      // If high quality fails to load, keep the placeholder
      console.error('Failed to load high-quality hero image');
    };
    // Start loading the high-quality image
    img.src = this.heroImageHighQuality;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;
    const servicesContent = document.querySelector('.services-content') as HTMLElement;
    if (heroContent) this.updateHeroParallax(scrollY, heroContent);
    if (servicesContent) this.updateServicesParallax(scrollY, servicesContent);
  }

  private updateHeroParallax(scrollY: number, heroContent: HTMLElement): void {
    const parallaxSpeed = 0.8;
    heroContent.style.transform = `translateY(${-scrollY * parallaxSpeed}px)`;
    const fadeStart = 50;
    const fadeEnd = 300;
    if (scrollY <= fadeStart) {
      heroContent.style.opacity = '1';
    } else if (scrollY <= fadeEnd) {
      const opacity = Math.max(0, Math.min(1, (fadeEnd - scrollY) / (fadeEnd - fadeStart)));
      heroContent.style.opacity = opacity.toString();
    } else {
      const opacity = Math.max(0, Math.min(1, (scrollY - fadeEnd + 100) / 100));
      heroContent.style.opacity = opacity.toString();
    }
  }

  private updateServicesParallax(scrollY: number, servicesContent: HTMLElement): void {
    const aboutSection = document.getElementById(SECTION_IDS.ABOUT);
    if (!aboutSection) return;
    const aboutTop = aboutSection.offsetTop;
    const servicesStart = aboutTop + 200;
    const servicesEnd = aboutTop + 600;
    if (scrollY >= servicesStart && scrollY <= servicesEnd) {
      const parallaxSpeed = 0.2;
      const relativeScroll = scrollY - servicesStart;
      const maxMovement = 80;
      const movement = Math.min(relativeScroll * parallaxSpeed, maxMovement);
      servicesContent.style.transform = `translateY(${movement}px)`;
      const fadeProgress = Math.min(1, (scrollY - servicesStart) / 200);
      servicesContent.style.opacity = fadeProgress.toString();
    } else if (scrollY > servicesEnd) {
      servicesContent.style.transform = 'translateY(80px)';
      servicesContent.style.opacity = '1';
    } else {
      servicesContent.style.transform = 'translateY(0px)';
      servicesContent.style.opacity = '0';
    }
  }

  navigateToBookingForm(): void {
    this.router.navigate([`/${this.currentLanguage}/booking`]).then(() => {
      setTimeout(() => {
        const formSection = document.getElementById(SECTION_IDS.BOOKING_FORM);
        if (formSection) {
          const targetY = formSection.getBoundingClientRect().top + window.pageYOffset - SCROLL_TO_FORM_OFFSET_PX;
          this.scrollService.smoothScrollTo(targetY, { duration: 1200 });
        }
      }, 300);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
