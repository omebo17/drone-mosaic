import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // Image loading states
  heroImageLoaded = false;
  heroImageLowQuality = 'assets/images/drones-placeholder.png';
  heroImageHighQuality = 'assets/images/drones.png';
  currentHeroImage = this.heroImageLowQuality;
  
  // Static variable to track if high quality image is already loaded across component instances
  private static highQualityImageCached = false;

  constructor() { }

  ngOnInit(): void {
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content') as HTMLElement;
    const servicesContent = document.querySelector('.services-content') as HTMLElement;
    
    // Hero section parallax
    if (heroContent) {
      // Slower parallax effect
      const parallaxSpeed = 0.8;
      heroContent.style.transform = `translateY(${-scrollY * parallaxSpeed}px)`;
      
      // Opacity changes based on scroll position
      const fadeStart = 50;
      const fadeEnd = 300;
      
      if (scrollY <= fadeStart) {
        // Full opacity when at top
        heroContent.style.opacity = '1';
      } else if (scrollY <= fadeEnd) {
        // Fade out as scrolling down
        const opacity = Math.max(0, Math.min(1, (fadeEnd - scrollY) / (fadeEnd - fadeStart)));
        heroContent.style.opacity = opacity.toString();
      } else {
        // Fade back in when scrolling up from below fadeEnd
        const opacity = Math.max(0, Math.min(1, (scrollY - fadeEnd + 100) / 100));
        heroContent.style.opacity = opacity.toString();
      }
    }
    
    // Services section parallax
    if (servicesContent) {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        const aboutTop = aboutSection.offsetTop;
        const servicesStart = aboutTop + 200; // Start parallax when services section comes into view
        const servicesEnd = aboutTop + 600; // Reduced end point to prevent extra scroll
        
        if (scrollY >= servicesStart && scrollY <= servicesEnd) {
          // Parallax effect: move content slower than scroll with limited movement
          const parallaxSpeed = 0.2; // Reduced speed
          const relativeScroll = scrollY - servicesStart;
          const maxMovement = 80; // Limit maximum movement
          const movement = Math.min(relativeScroll * parallaxSpeed, maxMovement);
          servicesContent.style.transform = `translateY(${movement}px)`;
          
          // Fade in effect as section comes into view
          const fadeProgress = Math.min(1, (scrollY - servicesStart) / 200);
          servicesContent.style.opacity = fadeProgress.toString();
        } else if (scrollY > servicesEnd) {
          // Keep final position (limited)
          servicesContent.style.transform = `translateY(80px)`; // Fixed maximum
          servicesContent.style.opacity = '1';
        } else {
          // Reset when above services section
          servicesContent.style.transform = 'translateY(0px)';
          servicesContent.style.opacity = '0';
        }
      }
    }
  }

}
