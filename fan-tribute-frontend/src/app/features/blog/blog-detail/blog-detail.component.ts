import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BlogActions } from '../../../store/blog/blog.actions';
import { selectSelectedPost, selectBlogLoading } from '../../../store/blog/blog.selectors';
import { BlogPost } from '../../../shared/models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <a routerLink="/blog" class="inline-flex items-center gap-2 text-electric-blue hover:text-white mb-8 transition-colors">
          <span>←</span> Volver al blog
        </a>

        @if (loading()) {
          <div class="animate-pulse space-y-6">
            <div class="h-10 bg-white/5 rounded w-3/4"></div>
            <div class="h-64 bg-white/5 rounded-2xl"></div>
            <div class="space-y-3">
              @for (item of [1,2,3,4,5]; track item) {
                <div class="h-4 bg-white/5 rounded"></div>
              }
            </div>
          </div>
        } @else if (post()) {
          <article>
            <h1 class="text-4xl font-rajdhani font-bold text-white mb-4">{{ post()!.title }}</h1>
            <div class="flex items-center gap-4 text-gray-400 text-sm mb-8">
              <span>{{ post()!.publishedAt | date:'longDate' }}</span>
              <span>·</span>
              <span>{{ post()!.readTime }} min lectura</span>
            </div>
            @if (post()!.bannerUrl) {
              <img [src]="post()!.bannerUrl" [alt]="post()!.title" class="w-full rounded-2xl object-cover h-64 md:h-96 mb-8" />
            }
            <div class="text-gray-300 leading-relaxed" [innerHTML]="post()!.content"></div>
          </article>
        } @else {
          <div class="text-center py-20">
            <p class="text-gray-400 text-xl">Artículo no encontrado</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class BlogDetailComponent implements OnInit {
  readonly slug = input<string>('');

  private readonly store = inject(Store);
  post = this.store.selectSignal<BlogPost | null>(selectSelectedPost);
  loading = this.store.selectSignal(selectBlogLoading);

  ngOnInit(): void {
    if (this.slug()) {
      this.store.dispatch(BlogActions.loadPost({ slug: this.slug() }));
    }
  }
}
