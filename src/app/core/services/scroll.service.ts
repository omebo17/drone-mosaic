import { Injectable } from '@angular/core';

export interface SmoothScrollOptions {
  duration?: number;
  onComplete?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  /**
   * Smooth scroll to a target Y position using requestAnimationFrame and easeInOutQuad.
   */
  smoothScrollTo(targetY: number, options: SmoothScrollOptions = {}): void {
    const { duration = 500, onComplete } = options;
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let start: number | undefined;

    const step = (timestamp: number) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  }
}
