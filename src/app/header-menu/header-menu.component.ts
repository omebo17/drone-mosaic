import { Component, OnInit, OnDestroy, HostListener, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { ScrollService } from '../core/services/scroll.service';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavItem } from '../shared/models/nav-item.model';
import { NAV_ITEMS } from '../core/constants/nav-items.constants';
import { HEADER_OFFSET_PX, HEADER_OFFSET_CONTACT_PX, SECTION_IDS } from '../core/constants/layout.constants';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  navItems: NavItem[] = NAV_ITEMS;
  readonly sectionIds = SECTION_IDS;

  activeSection: string = 'home';
  /** Current active nav id (home | about | services | pricing | howItWorks). */
  activeNavId: string = 'home';
  /** Previous active nav id for drone flight direction. */
  previousActiveNavId: string = 'home';
  currentLanguage: string = 'ka';
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

  private routerSub: Subscription | null = null;
  private navLinksSub: Subscription | null = null;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    this.syncActiveFromRouteAndScroll();
    
    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => {
      this.translations = translations;
      setTimeout(() => this.updateDronePosition(), 50);
    });

    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
    });

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
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
    this.navLinksSub = this.navLinks.changes.pipe(takeUntil(this.destroy$)).subscribe(() => setTimeout(() => this.updateDronePosition(), 0));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerSub?.unsubscribe();
    this.navLinksSub?.unsubscribe();
    if (this.tiltTimeout) clearTimeout(this.tiltTimeout);
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
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
    const homeSection = document.getElementById(SECTION_IDS.HOME);
    const aboutSection = document.getElementById(SECTION_IDS.ABOUT);
    const servicesSection = document.getElementById(SECTION_IDS.SERVICES);

    if (homeSection && aboutSection && servicesSection) {
      const aboutTop = aboutSection.offsetTop - HEADER_OFFSET_CONTACT_PX;
      const servicesTop = servicesSection.offsetTop - HEADER_OFFSET_CONTACT_PX;
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
    if (url.includes('/blog')) {
      this.setActiveNavId('blog');
      return;
    }
    if (url.includes('/drone-show')) {
      this.setActiveNavId('droneShow');
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

    const element = document.getElementById(sectionId);
    if (element) {
      const targetY = sectionId === SECTION_IDS.HOME ? 0 : element.offsetTop - HEADER_OFFSET_PX;
      this.scrollService.smoothScrollTo(targetY, {
        duration: 800,
        onComplete: () => {
          setTimeout(() => { this.isScrollingProgrammatically = false; }, 100);
        },
      });
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
      else if (item.id === 'blog') this.navigateToBlog();
      else this.navigateToRoute(item.routePath);
    }
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

  navigateToBlog(): void {
    this.router.navigate([`/${this.currentLanguage}/blog`]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToRoute(routePath: string): void {
    this.router.navigate([`/${this.currentLanguage}/${routePath}`]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  scrollToContact(): void {
    const contactSection = document.getElementById(SECTION_IDS.CONTACT_INFO);
    if (contactSection) {
      const y = contactSection.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET_CONTACT_PX;
      this.scrollService.smoothScrollTo(y);

      setTimeout(() => {
        contactSection.classList.add('highlight-contact');
        setTimeout(() => contactSection.classList.remove('highlight-contact'), 4000);
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
