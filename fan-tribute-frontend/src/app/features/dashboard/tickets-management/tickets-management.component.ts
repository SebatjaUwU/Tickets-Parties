import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';

interface ValidationResult {
  valid: boolean;
  message: string;
  ticket?: {
    id: string;
    eventTitle?: string;
    tierName?: string;
    holderName?: string;
    usedAt?: string;
  };
}

@Component({
  selector: 'app-tickets-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Gestión de Entradas</h1>
        <button class="btn-secondary text-sm">Exportar CSV</button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (stat of stats; track stat.label) {
          <div class="glass rounded-xl p-4">
            <div class="text-2xl font-rajdhani font-bold text-electric-blue">{{ stat.value }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ stat.label }}</div>
          </div>
        }
      </div>

      <!-- QR Scanner section -->
      <div class="glass-card rounded-2xl p-6 mb-6">
        <h3 class="text-white font-semibold mb-4">Validar entrada por código QR</h3>
        <div class="flex gap-3">
          <input
            type="text"
            [(ngModel)]="qrInput"
            placeholder="Escanear o ingresar código QR..."
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue-500 transition-colors font-mono text-sm"
            (keydown.enter)="validateQr()"
          />
          <button
            (click)="validateQr()"
            [disabled]="!qrInput.trim() || validating()"
            class="btn-primary min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (validating()) {
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Validando
              </span>
            } @else {
              Validar
            }
          </button>
        </div>

        <!-- Validation result -->
        @if (validationResult()) {
          <div
            class="mt-4 p-4 rounded-xl border"
            [class.border-green-500]="validationResult()!.valid"
            [class.bg-green-500]="validationResult()!.valid"
            [class.bg-opacity-10]="validationResult()!.valid"
            [class.border-red-500]="!validationResult()!.valid"
            [class.bg-red-500]="!validationResult()!.valid"
          >
            <p class="font-semibold" [class.text-green-400]="validationResult()!.valid" [class.text-red-400]="!validationResult()!.valid">
              {{ validationResult()!.message }}
            </p>
            @if (validationResult()!.ticket) {
              <div class="mt-3 space-y-1 text-sm text-gray-300">
                @if (validationResult()!.ticket!.holderName) {
                  <p>👤 Titular: <span class="text-white font-medium">{{ validationResult()!.ticket!.holderName }}</span></p>
                }
                @if (validationResult()!.ticket!.eventTitle) {
                  <p>🎪 Evento: <span class="text-white font-medium">{{ validationResult()!.ticket!.eventTitle }}</span></p>
                }
                @if (validationResult()!.ticket!.tierName) {
                  <p>🎫 Tier: <span class="text-white font-medium">{{ validationResult()!.ticket!.tierName }}</span></p>
                }
              </div>
            }
          </div>
        }
      </div>

      <div class="glass rounded-2xl p-8 text-center text-gray-400">
        <p class="text-4xl mb-3">🎟️</p>
        <p>El listado detallado de entradas y reportes estará disponible próximamente.</p>
      </div>
    </div>
  `,
})
export class TicketsManagementComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  qrInput = '';
  validating = signal(false);
  validationResult = signal<ValidationResult | null>(null);

  stats = [
    { label: 'Entradas vendidas', value: '—' },
    { label: 'Validadas hoy',     value: '—' },
    { label: 'Pendientes',        value: '—' },
    { label: 'Transferidas',      value: '—' },
  ];

  validateQr(): void {
    const code = this.qrInput.trim();
    if (!code || this.validating()) return;

    this.validating.set(true);
    this.validationResult.set(null);

    this.http.post<any>(`${environment.apiUrl}/tickets/validate-qr`, { qrCode: code })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (res) => {
        this.validating.set(false);
        this.validationResult.set({
          valid: true,
          message: '✅ Entrada válida — acceso permitido',
          ticket: {
            id: res.id ?? res.ticketId,
            eventTitle: res.eventTitle ?? res.event?.title,
            tierName:   res.tierName  ?? res.tier?.name,
            holderName: res.holderName ?? (`${res.user?.firstName ?? ''} ${res.user?.lastName ?? ''}`.trim() || undefined),
          },
        });
        this.qrInput = '';
      },
      error: (err) => {
        this.validating.set(false);
        const msg = err?.error?.message ?? 'Entrada inválida o ya utilizada';
        this.validationResult.set({ valid: false, message: `❌ ${msg}` });
      },
    });
  }
}
