import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { NewsCardComponent } from '../../../shared/components/news-card/news-card.component';
import { BlogActions } from '../../../store/blog/blog.actions';
import { selectAllPosts, selectBlogLoading } from '../../../store/blog/blog.selectors';
import { BlogPost } from '../../../shared/models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, NewsCardComponent],
  template: `
    <section class="min-h-screen bg-dark-900 pt-24 pb-16">
      <div class="container mx-auto px-4">

        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-rajdhani font-bold text-white mb-4">
            BLOG & <span class="text-electric-blue">NOTICIAS</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Lo último del mundo EDM: festivales, artistas, lanzamientos y más
          </p>
        </div>

        <!-- Posts grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (item of skeletons; track $index) {
              <div class="glass rounded-2xl overflow-hidden animate-pulse">
                <div class="bg-white/5 h-52"></div>
                <div class="p-6 space-y-3">
                  <div class="h-4 bg-white/5 rounded w-1/3"></div>
                  <div class="h-5 bg-white/5 rounded"></div>
                  <div class="h-4 bg-white/5 rounded w-5/6"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (post of posts(); track post.id) {
              <ft-news-card [post]="post" />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class BlogListComponent implements OnInit {
  private readonly store = inject(Store);

  posts = this.store.selectSignal<BlogPost[]>(selectAllPosts);
  loading = this.store.selectSignal(selectBlogLoading);
  skeletons = Array(6).fill(0);

  ngOnInit(): void {
    this.store.dispatch(BlogActions.loadFeaturedPosts());
  }
}
