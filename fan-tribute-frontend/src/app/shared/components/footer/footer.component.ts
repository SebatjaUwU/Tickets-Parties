import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONFIG } from '../../../core/config/app.config';

@Component({
  selector: 'ft-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-edm-black border-t border-white/5 pt-16 pb-8">
      <div class="container-custom">
        <!-- Main grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <!-- Brand -->
          <div>
            <div class="mb-4">
              <img src="logo.png" alt="FAN TRIBUTE" class="h-10 w-auto object-contain" />
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-5">
              La plataforma EDM #1 de Colombia y Latinoamérica. Descubre eventos, artistas y vive la música electrónica al máximo.
            </p>
            <!-- Social links -->
            <div class="flex items-center gap-3">
              @for (social of socials; track social.name) {
                <a [href]="social.url" target="_blank" rel="noopener"
                  class="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110"
                  [title]="social.name"
                  [innerHTML]="social.icon"
                ></a>
              }
            </div>
          </div>

          <!-- Links -->
          @for (section of footerLinks; track section.title) {
            <div>
              <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">{{ section.title }}</h4>
              <ul class="space-y-2.5">
                @for (link of section.links; track link.label) {
                  <li>
                    <a
                      [routerLink]="link.path"
                      class="text-gray-400 text-sm hover:text-white transition-colors hover:translate-x-1 inline-block transform"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Contact -->
          <div>
            <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-electric-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {{ email }}
              </li>
            </ul>
          </div>
        </div>

        <div class="divider-glow"></div>

        <!-- Bottom bar -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p class="text-gray-500 text-sm">
            © 2025 FAN TRIBUTE. Todos los derechos reservados.
          </p>
          <div class="flex items-center gap-6 text-sm">
            <a routerLink="/privacidad" class="text-gray-500 hover:text-white transition-colors">Privacidad</a>
            <a routerLink="/terminos" class="text-gray-500 hover:text-white transition-colors">Términos</a>
            <a routerLink="/cookies" class="text-gray-500 hover:text-white transition-colors">Cookies</a>
          </div>
          <div class="flex items-center gap-1 text-gray-600 text-xs">
            <span>Hecho con</span>
            <span class="text-red-500">❤️</span>
            <span>para la comunidad EDM</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly email = APP_CONFIG.email;

  readonly socials = [
    {
      name: 'Instagram',
      url: APP_CONFIG.instagram,
      icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    },
    {
      name: 'Twitter/X',
      url: APP_CONFIG.twitter,
      icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    },
    {
      name: 'YouTube',
      url: APP_CONFIG.youtube,
      icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>',
    },
    {
      name: 'Spotify',
      url: 'https://open.spotify.com',
      icon: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    },
  ];

  readonly footerLinks = [
    {
      title: 'Plataforma',
      links: [
        { label: 'Inicio', path: '/' },
        { label: 'Eventos', path: '/eventos' },
        { label: 'Merch', path: '/merch' },
      ],
    },
    {
      title: 'Cuenta',
      links: [
        { label: 'Iniciar Sesión', path: '/auth/login' },
        { label: 'Registrarse', path: '/auth/registro' },
        { label: 'Mi Perfil', path: '/perfil' },
      ],
    },
  ];

}
