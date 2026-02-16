import { Component, OnInit, OnDestroy, HostListener, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { filter } from 'rxjs/operators';

export interface NavItem {
  id: string;
  labelKey: string;
  type: 'scroll' | 'route';
  sectionId?: string;
  routePath?: string;
}

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  /** All nav items in order – active state works for every item (scroll-based + route-based). */
  navItems: NavItem[] = [
    { id: 'home', labelKey: 'header.nav.home', type: 'scroll', sectionId: 'home-section' },
    { id: 'about', labelKey: 'header.nav.about', type: 'scroll', sectionId: 'about-section' },
    { id: 'services', labelKey: 'header.nav.services', type: 'scroll', sectionId: 'services-section' },
    { id: 'pricing', labelKey: 'header.nav.pricing', type: 'route', routePath: 'booking' },
    { id: 'howItWorks', labelKey: 'header.nav.howItWorks', type: 'route', routePath: 'how-it-works' },
  ];

  activeSection: string = 'home';
  /** Current active nav id (home | about | services | pricing | howItWorks). */
  activeNavId: string = 'home';
  /** Previous active nav id for drone flight direction. */
  previousActiveNavId: string = 'home';
  currentLanguage: string = 'en';
  private isScrollingProgrammatically: boolean = false;
  private scrollTimeout: any;
  translations: any = {};
  isMobileMenuOpen: boolean = false;

  /** Drone indicator position (px from left of nav container) and tilt for flight animation. */
  droneLeft = 0;
  droneTiltDirection: 'left' | 'right' | null = null;
  private tiltTimeout: any;

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef<HTMLElement>>;

  private routerSub: any;

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.syncActiveFromRouteAndScroll();
    
    this.languageService.translations$.subscribe(translations => {
      this.translations = translations;
    });
    
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const urlSegments = this.router.url.split('/');
      const langCode = urlSegments[1];
      if (langCode === 'en' || langCode === 'ka') {
        this.currentLanguage = langCode;
        this.languageService.setLanguage(langCode);
      }
      this.syncActiveFromRouteAndScroll();
      this.updateDronePosition();
    });
    
    const urlSegments = this.router.url.split('/');
    const langCode = urlSegments[1];
    if (langCode === 'en' || langCode === 'ka') {
      this.currentLanguage = langCode;
      this.languageService.setLanguage(langCode);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateDronePosition(), 0);
    this.navLinks.changes.subscribe(() => setTimeout(() => this.updateDronePosition(), 0));
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.tiltTimeout) clearTimeout(this.tiltTimeout);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isScrollingProgrammatically) return;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.updateActiveSection();
      this.syncActiveNavId();
      this.updateDronePosition();
    }, 100);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDronePosition();
  }

  /** Updates activeSection from scroll (home, about, services). */
  updateActiveSection(): void {
    const scrollY = window.scrollY;
    const homeSection = document.getElementById('home-section');
    const aboutSection = document.getElementById('about-section');
    const servicesSection = document.getElementById('services-section');
    
    if (homeSection && aboutSection && servicesSection) {
      const aboutTop = aboutSection.offsetTop - 100;
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

  /** Sets activeNavId from route (pricing / howItWorks) or from activeSection (home / about / services). */
  syncActiveFromRouteAndScroll(): void {
    this.updateActiveSection();
    this.syncActiveNavId();
  }

  private syncActiveNavId(): void {
    const url = this.router.url;
    if (url.includes('/booking')) {
      this.setActiveNavId('pricing');
      return;
    }
    if (url.includes('/how-it-works')) {
      this.setActiveNavId('howItWorks');
      return;
    }
    this.setActiveNavId(this.activeSection);
  }

  private setActiveNavId(id: string): void {
    if (id === this.activeNavId) return;
    this.previousActiveNavId = this.activeNavId;
    this.activeNavId = id;
    this.updateDronePositionWithTilt();
  }

  /** Compute active nav id (for template). */
  getActiveNavId(): string {
    return this.activeNavId;
  }

  isNavItemActive(item: NavItem): boolean {
    return this.activeNavId === item.id;
  }

  /** Position drone under the active nav link; optionally apply tilt and then align. */
  private updateDronePositionWithTilt(): void {
    const prevIndex = this.navItems.findIndex(i => i.id === this.previousActiveNavId);
    const currIndex = this.navItems.findIndex(i => i.id === this.activeNavId);
    this.droneTiltDirection = currIndex > prevIndex ? 'right' : currIndex < prevIndex ? 'left' : null;
    this.updateDronePosition();
    if (this.tiltTimeout) clearTimeout(this.tiltTimeout);
    this.tiltTimeout = setTimeout(() => {
      this.droneTiltDirection = null;
    }, 400);
  }

  updateDronePosition(): void {
    const container = this.navContainer?.nativeElement;
    const links = this.navLinks?.toArray();
    if (!container || !links?.length) return;
    const idx = this.navItems.findIndex(i => i.id === this.activeNavId);
    const linkEl = links[idx]?.nativeElement;
    if (!linkEl) return;
    const cr = container.getBoundingClientRect();
    const lr = linkEl.getBoundingClientRect();
    this.droneLeft = lr.left - cr.left + lr.width / 2;
  }

  scrollToSection(sectionId: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    const sectionName = sectionId.replace('-section', '');
    
    // Check if we're on the booking page or not on the homepage
    const currentUrl = this.router.url;
    const isOnBookingPage = currentUrl.includes('/booking');
    const isOnHomepage = currentUrl.endsWith('/en') || currentUrl.endsWith('/ka') || currentUrl === '/en' || currentUrl === '/ka';
    
    if (isOnBookingPage || !isOnHomepage) {
      // Navigate to homepage first, then scroll to section
      this.router.navigate([`/${this.currentLanguage}`]).then(() => {
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          this.scrollToSectionOnHomepage(sectionId);
        }, 100);
      });
    } else {
      // We're already on homepage, scroll directly
      this.scrollToSectionOnHomepage(sectionId);
    }
  }

  private scrollToSectionOnHomepage(sectionId: string): void {
    const sectionName = sectionId.replace('-section', '');
    
    this.isScrollingProgrammatically = true;
    this.activeSection = sectionName;
    this.setActiveNavId(sectionName);
    
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
    
    if (element) {
      let targetY: number;
      if (sectionId === 'home-section') {
        targetY = 0;
      } else {
        targetY = element.offsetTop - 90;
      }
      smoothScrollTo(targetY);
    } else {
      this.isScrollingProgrammatically = false;
    }
  }

  handleNavClick(item: NavItem, event?: Event): void {
    if (event) event.preventDefault();
    if (item.type === 'scroll' && item.sectionId) {
      this.scrollToSection(item.sectionId, event);
    } else if (item.type === 'route' && item.routePath) {
      if (item.id === 'pricing') this.navigateToBooking();
      else if (item.id === 'howItWorks') this.navigateToHowItWorks();
    }
  }

  getNavLabel(item: NavItem): string {
    const key = item.labelKey;
    const t = this.translations?.header?.nav;
    if (key === 'header.nav.home') return t?.home ?? 'Home';
    if (key === 'header.nav.about') return t?.about ?? 'About';
    if (key === 'header.nav.services') return t?.services ?? 'Services';
    if (key === 'header.nav.pricing') return t?.pricing ?? 'Pricing';
    if (key === 'header.nav.howItWorks') return t?.howItWorks ?? 'How It Works';
    return key;
  }

  switchLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.languageService.setLanguage(lang);
    
    // Get current URL and replace the language code
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');
    
    // Replace the language segment (first segment after /)
    if (urlSegments[1] === 'en' || urlSegments[1] === 'ka') {
      urlSegments[1] = lang;
      const newUrl = urlSegments.join('/');
      this.router.navigateByUrl(newUrl);
    } else {
      // Fallback to homepage if route structure is unexpected
      this.router.navigate([`/${lang}`]);
    }
  }

  navigateToBooking(): void {
    this.router.navigate([`/${this.currentLanguage}/booking`]).then(() => {
      // Scroll to top when navigating to booking page
      window.scrollTo(0, 0);
    });
  }

  navigateToHowItWorks(): void {
    this.router.navigate([`/${this.currentLanguage}/how-it-works`]).then(() => {
      // Scroll to top when navigating to how-it-works page
      window.scrollTo(0, 0);
    });
  }

  scrollToContact(): void {
    const contactSection = document.getElementById('contact-info');
    if (contactSection) {
      const yOffset = -100; // Offset for fixed header
      const y = contactSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      // Add highlight animation
      setTimeout(() => {
        contactSection.classList.add('highlight-contact');
        
        // Remove the class after animation completes (4 seconds total)
        setTimeout(() => {
          contactSection.classList.remove('highlight-contact');
        }, 4000);
      }, 500);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

}
