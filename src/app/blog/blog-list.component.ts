import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { BlogService } from '../core/services/blog.service';
import { BlogPost } from '../core/models/blog-post.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  posts: BlogPost[] = [];
  currentLanguage = 'ka';
  translations: any;

  constructor(
    private blogService: BlogService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.currentLanguage = this.languageService.currentLanguage;
    this.posts = this.blogService.getPosts(this.currentLanguage);

    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(t => {
      this.translations = t;
    });
    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
      this.posts = this.blogService.getPosts(lang);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openPost(post: BlogPost): void {
    this.router.navigate([`/${this.currentLanguage}/blog`, post.slug]).then(() => window.scrollTo(0, 0));
  }
}
