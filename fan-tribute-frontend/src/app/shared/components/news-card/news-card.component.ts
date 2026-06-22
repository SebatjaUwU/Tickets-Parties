import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogPost } from '../../models';

@Component({
  selector: 'ft-news-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <article class="glass-card group overflow-hidden" [routerLink]="['/blog', post().slug]">
      <!-- Banner -->
      <div class="relative aspect-video overflow-hidden">
        <img
          [src]="post().bannerUrl ?? 'assets/images/news-placeholder.jpg'"
          [alt]="post().title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-card"></div>
        @if (post().category) {
          <span class="absolute top-3 left-3 badge badge-blue text-xs">{{ post().category!.name }}</span>
        }
      </div>

      <div class="p-5">
        <!-- Meta -->
        <div class="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <span>{{ post().publishedAt | date:'d MMM yyyy' }}</span>
          <span>·</span>
          <span>{{ post().readTime }} min de lectura</span>
          <span>·</span>
          <span>{{ post().viewsCount }} vistas</span>
        </div>

        <!-- Title -->
        <h3 class="text-white font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-electric-blue-300 transition-colors font-display">
          {{ post().title }}
        </h3>

        <!-- Excerpt -->
        @if (post().excerpt) {
          <p class="text-gray-400 text-sm line-clamp-3 mb-4">{{ post().excerpt }}</p>
        }

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <div class="flex items-center gap-2">
            <img
              [src]="post().author?.avatarUrl ?? 'assets/images/avatar-default.png'"
              [alt]="post().author.firstName"
              class="w-7 h-7 rounded-lg object-cover"
            />
            <span class="text-gray-400 text-xs">{{ post().author.firstName }} {{ post().author.lastName }}</span>
          </div>
          <div class="flex items-center gap-3 text-gray-500 text-xs">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              {{ post().likesCount }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              {{ post().commentsCount }}
            </span>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `]
})
export class NewsCardComponent {
  post = input.required<BlogPost>();
}
