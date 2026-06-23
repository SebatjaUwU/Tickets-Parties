import { Component } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';

const MERCH_FORM_URL = 'https://forms.google.com/PLACEHOLDER';

interface MerchItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

@Component({
  selector: 'ft-merch',
  standalone: true,
  imports: [NgClass, DecimalPipe],
  template: `
    <!-- Hero -->
    <section class="relative py-24 overflow-hidden bg-black">
      <div class="absolute inset-0">
        <div class="absolute top-1/3 left-1/4 w-96 h-96 bg-electric-blue-500/15 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-edm-orange-500/10 rounded-full blur-3xl"></div>
      </div>
      <div class="container-custom relative z-10 text-center">
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-electric-blue-500/30 mb-6 text-electric-blue-400 text-sm font-semibold tracking-widest uppercase">
          <span class="w-2 h-2 bg-electric-blue-500 rounded-full animate-pulse"></span>
          Colección Oficial
        </span>
        <h1 class="text-5xl md:text-7xl font-black text-white font-display mb-4">
          FAN TRIBUTE <span class="gradient-text">MERCH</span>
        </h1>
        <p class="text-gray-300 text-lg max-w-xl mx-auto">
          Representa la cultura EDM con nuestra colección exclusiva. Ropa y accesorios para los verdaderos fans.
        </p>
      </div>
    </section>

    <!-- Filter tabs -->
    <section class="bg-dark-blue-800 border-b border-white/5 sticky top-[4.5rem] z-30">
      <div class="container-custom">
        <div class="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          @for (cat of categories; track cat) {
            <button
              (click)="activeCategory = cat"
              class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
              [ngClass]="activeCategory === cat
                ? 'bg-electric-blue-500 text-white shadow-glow-blue'
                : 'glass text-gray-400 hover:text-white hover:bg-white/10'"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Products grid -->
    <section class="section bg-gradient-to-b from-dark-blue-800 to-black">
      <div class="container-custom">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (item of filteredItems(); track item.id) {
            <article class="glass-card overflow-hidden group">
              <!-- Image -->
              <div class="relative aspect-square overflow-hidden bg-dark-blue-800">
                <img
                  [src]="item.image"
                  [alt]="item.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                @if (item.badge) {
                  <span class="absolute top-3 left-3 badge badge-orange text-xs">{{ item.badge }}</span>
                }
                <!-- Quick order overlay -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    [href]="formUrl"
                    target="_blank"
                    rel="noopener"
                    class="btn-primary text-sm px-5 py-2.5 shadow-glow-blue"
                  >
                    Ordenar ahora
                  </a>
                </div>
              </div>

              <!-- Info -->
              <div class="p-4">
                <span class="text-xs text-electric-blue-400 font-semibold uppercase tracking-wider">{{ item.category }}</span>
                <h3 class="text-white font-bold mt-1 mb-1 font-display">{{ item.name }}</h3>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">{{ item.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-white font-black text-xl font-display">
                    {{ item.price | number:'1.0-0' }}<span class="text-gray-400 text-sm font-normal"> COP</span>
                  </span>
                  <a
                    [href]="formUrl"
                    target="_blank"
                    rel="noopener"
                    class="btn-primary text-xs px-4 py-2"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </article>
          }
        </div>

        <!-- Empty state -->
        @if (filteredItems().length === 0) {
          <div class="text-center py-20">
            <p class="text-5xl mb-4">🛍️</p>
            <h3 class="text-white font-bold text-xl mb-2">Sin productos en esta categoría</h3>
            <p class="text-gray-400">Pronto habrá nuevos artículos disponibles.</p>
          </div>
        }
      </div>
    </section>

    <!-- CTA banner -->
    <section class="section bg-gradient-to-r from-electric-blue-900 via-dark-blue-800 to-edm-orange-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-1/3 w-64 h-64 bg-electric-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div class="container-custom relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-black text-white font-display mb-4">
          ¿Quieres un diseño <span class="gradient-text">personalizado?</span>
        </h2>
        <p class="text-gray-300 mb-8 max-w-lg mx-auto">
          Contáctanos y creamos merch exclusivo para tu crew o evento.
        </p>
        <a
          [href]="formUrl"
          target="_blank"
          rel="noopener"
          class="btn-primary px-10 py-4 text-lg font-black"
        >
          Hacer pedido personalizado →
        </a>
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class MerchComponent {
  readonly formUrl = MERCH_FORM_URL;
  activeCategory = 'Todo';

  readonly categories = ['Todo', 'Ropa', 'Accesorios', 'Coleccionables'];

  readonly items: MerchItem[] = [
    {
      id: 1,
      name: 'Camiseta EDM Summer',
      description: 'Camiseta oficial del EDM Summer Event. 100% algodón premium, corte unisex.',
      price: 75000,
      category: 'Ropa',
      image: 'assets/images/merch-placeholder.jpg',
      badge: 'Nuevo',
    },
    {
      id: 2,
      name: 'Hoodie FAN TRIBUTE',
      description: 'Sudadera con capucha bordada. Perfecta para las noches de festival.',
      price: 150000,
      category: 'Ropa',
      image: 'assets/images/merch-placeholder.jpg',
      badge: 'Exclusivo',
    },
    {
      id: 3,
      name: 'Gorra Snapback',
      description: 'Gorra ajustable con logo bordado FAN TRIBUTE. Disponible en negro y azul.',
      price: 60000,
      category: 'Accesorios',
      image: 'assets/images/merch-placeholder.jpg',
    },
    {
      id: 4,
      name: 'Mochila Festival',
      description: 'Mochila resistente al agua, diseño EDM. Perfecta para llevar al festival.',
      price: 120000,
      category: 'Accesorios',
      image: 'assets/images/merch-placeholder.jpg',
    },
    {
      id: 5,
      name: 'Camiseta Oversized',
      description: 'Corte oversized con gráfico EDM en la espalda. Edición limitada.',
      price: 85000,
      category: 'Ropa',
      image: 'assets/images/merch-placeholder.jpg',
      badge: 'Ed. Limitada',
    },
    {
      id: 6,
      name: 'Pulsera de Tela',
      description: 'Pack de 3 pulseras estilo festival. Tejido resistente y lavable.',
      price: 25000,
      category: 'Accesorios',
      image: 'assets/images/merch-placeholder.jpg',
    },
    {
      id: 7,
      name: 'Poster Coleccionable',
      description: 'Poster A2 del EDM Summer Event. Impresión de alta calidad para enmarcar.',
      price: 35000,
      category: 'Coleccionables',
      image: 'assets/images/merch-placeholder.jpg',
    },
    {
      id: 8,
      name: 'Sticker Pack',
      description: 'Pack de 10 stickers con diseños EDM originales. Resistentes al agua.',
      price: 15000,
      category: 'Coleccionables',
      image: 'assets/images/merch-placeholder.jpg',
    },
  ];

  filteredItems(): MerchItem[] {
    if (this.activeCategory === 'Todo') return this.items;
    return this.items.filter(i => i.category === this.activeCategory);
  }
}
