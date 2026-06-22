import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tickets-management',
  standalone: true,
  imports: [CommonModule, DatePipe],
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

      <!-- Scanner section -->
      <div class="glass-card rounded-2xl p-6 mb-6">
        <h3 class="text-white font-semibold mb-4">Validar entrada por QR</h3>
        <div class="flex gap-3">
          <input
            type="text"
            placeholder="Escanear o ingresar código QR..."
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors font-mono text-sm"
          />
          <button class="btn-primary">Validar</button>
        </div>
      </div>

      <div class="glass rounded-2xl p-8 text-center text-gray-400">
        <p class="text-4xl mb-3">🎟️</p>
        <p>La gestión detallada de entradas estará disponible próximamente.</p>
      </div>
    </div>
  `,
})
export class TicketsManagementComponent {
  stats = [
    { label: 'Entradas vendidas', value: '1,240' },
    { label: 'Validadas hoy', value: '87' },
    { label: 'Pendientes', value: '53' },
    { label: 'Transferidas', value: '12' },
  ];
}
