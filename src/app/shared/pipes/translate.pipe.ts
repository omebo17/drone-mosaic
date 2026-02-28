import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription | null = null;
  private lastKey: string | null = null;
  private lastFallback: string | null = null;
  private value: string = '';

  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.languageService.translations$.subscribe(() => {
      if (this.lastKey != null) {
        this.value = this.resolve(this.lastKey, this.lastFallback ?? undefined);
        this.cdr.markForCheck();
      }
    });
  }

  transform(key: string, fallback?: string): string {
    this.lastKey = key;
    this.lastFallback = fallback ?? null;
    this.value = this.resolve(key, fallback);
    return this.value;
  }

  private resolve(key: string, fallback?: string): string {
    const result = this.languageService.getTranslation(key);
    if (result === key && fallback != null) {
      return fallback;
    }
    return result || fallback || key;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
