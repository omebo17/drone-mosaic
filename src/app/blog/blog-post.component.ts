import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { BlogService } from '../core/services/blog.service';
import { BlogPost } from '../core/models/blog-post.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  post: BlogPost | null = null;
  currentLanguage = 'ka';
  translations: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.currentLanguage = this.languageService.currentLanguage;

    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(t => {
      this.translations = t;
    });
    this.languageService.currentLanguage$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.currentLanguage = lang;
      this.reloadPost();
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.post = this.blogService.getPostBySlug(slug, this.currentLanguage) ?? null;
        if (!this.post) {
          this.router.navigate([`/${this.currentLanguage}/blog`]);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private reloadPost(): void {
    if (this.post) {
      this.post = this.blogService.getPostBySlug(this.post.slug, this.currentLanguage) ?? null;
    }
  }

  backToList(): void {
    this.router.navigate([`/${this.currentLanguage}/blog`]).then(() => window.scrollTo(0, 0));
  }
}
