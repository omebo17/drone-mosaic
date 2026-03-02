import { Injectable } from '@angular/core';
import { BlogPost } from '../models/blog-post.model';
import { BLOG_POSTS } from '../constants/blog-posts.constants';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  getPosts(lang?: string): BlogPost[] {
    return BLOG_POSTS.map(p => this.localize(p, lang));
  }

  getPostBySlug(slug: string, lang?: string): BlogPost | undefined {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    return post ? this.localize(post, lang) : undefined;
  }

  private localize(post: BlogPost, lang?: string): BlogPost {
    if (!lang || lang === 'en' || !post.translations?.[lang]) {
      return post;
    }
    const t = post.translations[lang];
    return { ...post, title: t.title, excerpt: t.excerpt, body: t.body };
  }
}
