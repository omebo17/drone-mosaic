import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../core/services/language.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  translations: any;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => {
      this.translations = translations;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
