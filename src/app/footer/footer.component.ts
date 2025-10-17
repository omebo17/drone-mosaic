import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  translations: any;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    // Subscribe to translation changes
    this.languageService.translations$.subscribe(translations => {
      this.translations = translations;
    });
  }

}
