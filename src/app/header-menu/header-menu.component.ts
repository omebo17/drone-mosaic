import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {

  activeSection: string = 'home';
  currentLanguage: string = 'en';
  private isScrollingProgrammatically: boolean = false;
  private scrollTimeout: any;
  translations: any = {};

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.updateActiveSection();
    
    // Subscribe to translations changes
    this.languageService.translations$.subscribe(translations => {
      this.translations = translations;
    });
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    
    // Get current language from route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const urlSegments = this.router.url.split('/');
      const langCode = urlSegments[1];
      if (langCode === 'en' || langCode === 'ka') {
        this.currentLanguage = langCode;
        this.languageService.setLanguage(langCode);
      }
    });
    
    // Set initial language from route
    const urlSegments = this.router.url.split('/');
    const langCode = urlSegments[1];
    if (langCode === 'en' || langCode === 'ka') {
      this.currentLanguage = langCode;
      this.languageService.setLanguage(langCode);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Don't update active section if we're programmatically scrolling
    if (this.isScrollingProgrammatically) {
      return;
    }
    
    // Debounce scroll events
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.updateActiveSection();
    }, 100);
  }

  updateActiveSection() {
    const scrollY = window.scrollY;
    const homeSection = document.getElementById('home-section');
    const aboutSection = document.getElementById('about-section');
    const servicesSection = document.getElementById('services-section');
    
    if (homeSection && aboutSection && servicesSection) {
      const aboutTop = aboutSection.offsetTop - 100; // 100px offset for header
      const servicesTop = servicesSection.offsetTop - 100;
      
      if (scrollY >= servicesTop) {
        this.activeSection = 'services';
      } else if (scrollY >= aboutTop) {
        this.activeSection = 'about';
      } else {
        this.activeSection = 'home';
      }
    }
  }

  scrollToSection(sectionId: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    const sectionName = sectionId.replace('-section', '');
    
    console.log('Attempting to scroll to:', sectionId, 'Current active:', this.activeSection);
    
    // Set flag to prevent scroll listener from interfering
    this.isScrollingProgrammatically = true;
    
    // Update active section immediately
    this.activeSection = sectionName;
    
    // Custom smooth scroll function
    const smoothScrollTo = (targetY: number) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const duration = 800; // milliseconds
      let start: number;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2; // easeInOutQuad
        
        window.scrollTo(0, startY + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Re-enable scroll listener after animation completes
          setTimeout(() => {
            this.isScrollingProgrammatically = false;
          }, 100);
        }
      };
      
      requestAnimationFrame(step);
    };
    
    const element = document.getElementById(sectionId);
    console.log('Element found:', element);
    
    if (element) {
      console.log('Scrolling to element:', element);
      
      // Calculate target position
      let targetY: number;
      
      if (sectionId === 'home-section') {
        targetY = 0;
      } else {
        targetY = element.offsetTop - 90; // Account for fixed header
      }
      
      // Use custom smooth scroll
      smoothScrollTo(targetY);
      
      console.log('Updated active section to:', this.activeSection);
    } else {
      console.log('Element not found for ID:', sectionId);
      // Re-enable scroll listener if element not found
      this.isScrollingProgrammatically = false;
    }
  }

  getNavLinkClass(section: string): string {
    const isActive = this.activeSection === section;
    const baseClasses = 'text-xl font-sans transition-colors cursor-pointer';
    
    if (isActive) {
      return `${baseClasses} text-gold border-b border-gold pb-1`;
    } else {
      return `${baseClasses} text-white hover:text-gold`;
    }
  }

  switchLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.languageService.setLanguage(lang);
    // Navigate to the same page with new language
    this.router.navigate([`/${lang}`]);
  }

}
