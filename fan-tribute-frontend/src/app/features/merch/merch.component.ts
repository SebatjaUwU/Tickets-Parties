import { Component } from '@angular/core';
import { APP_CONFIG, WHATSAPP_URL } from '../../core/config/app.config';

@Component({
  selector: 'ft-merch',
  standalone: true,
  imports: [],
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
          Representa la cultura EDM con nuestra colección exclusiva.
        </p>
      </div>
    </section>

    <!-- Product -->
    <section class="section bg-gradient-to-b from-dark-blue-800 to-black">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <!-- Image -->
            <div class="relative">
              <div class="aspect-square rounded-3xl overflow-hidden bg-dark-blue-800 border border-white/10">
                <img
                  src="assets/images/merch-placeholder.jpg"
                  alt="Camiseta EDM Summer"
                  class="w-full h-full object-cover"
                />
              </div>
              <span class="absolute top-4 left-4 badge badge-orange text-sm px-3 py-1">Edición Limitada</span>
            </div>

            <!-- Details -->
            <div class="space-y-6">
              <div>
                <span class="text-electric-blue-400 text-sm font-semibold uppercase tracking-wider">Ropa</span>
                <h2 class="text-4xl font-black text-white font-display mt-1 mb-3">Camiseta EDM Summer</h2>
                <p class="text-gray-300 leading-relaxed">
                  Camiseta oficial del EDM Summer Event. 100% algodón premium, corte unisex. Disponible en tallas S, M, L y XL.
                </p>
              </div>

              <!-- Price -->
              <div class="glass-dark rounded-2xl p-4 border border-electric-blue-500/20">
                <p class="text-gray-400 text-sm mb-1">Precio</p>
                <p class="text-3xl font-black text-white font-display">75.000 <span class="text-lg text-gray-400 font-normal">COP</span></p>
              </div>

              <!-- Features -->
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-gray-300 text-sm">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  100% algodón premium
                </li>
                <li class="flex items-center gap-2 text-gray-300 text-sm">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Tallas S, M, L, XL
                </li>
                <li class="flex items-center gap-2 text-gray-300 text-sm">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Diseño exclusivo EDM Summer Event
                </li>
                <li class="flex items-center gap-2 text-gray-300 text-sm">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Envío a todo Colombia
                </li>
              </ul>

              <!-- WhatsApp CTA -->
              <a
                [href]="whatsappUrl"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Pedir por WhatsApp
              </a>
              <p class="text-center text-gray-500 text-xs">
                Te responderemos en menos de 24 horas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class MerchComponent {
  readonly whatsappUrl = WHATSAPP_URL(APP_CONFIG.whatsappMerchMessage);
}
