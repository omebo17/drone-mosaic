import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {

  activeSection: string = 'home';
  private isScrollingProgrammatically: boolean = false;
  private scrollTimeout: any;

  constructor() { }

  ngOnInit(): void {
    this.updateActiveSection();
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
    
    if (homeSection && aboutSection) {
      const aboutTop = aboutSection.offsetTop - 100; // 100px offset for header
      
      if (scrollY >= aboutTop) {
        this.activeSection = 'about';
      } else {
        this.activeSection = 'home';
      }
    }
  }

  scrollToSection(sectionId: string) {
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

}
