import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoadingService } from '../../core/services/loading.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ft-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgClass],
  template: `
    <div class="min-h-screen bg-edm-black flex flex-col">
      <!-- Global loading bar -->
      @if (loadingService.isLoading()) {
        <div class="fixed top-0 left-0 right-0 z-[100] h-0.5">
          <div class="h-full bg-gradient-to-r from-electric-blue-500 via-edm-orange-500 to-electric-blue-500 animate-gradient-shift bg-[length:200%_100%]"></div>
        </div>
      }

      <ft-navbar />

      <main class="flex-1">
        <router-outlet />
      </main>

      <ft-footer />
    </div>
  `,
})
export class MainLayoutComponent {
  readonly loadingService = inject(LoadingService);
}
