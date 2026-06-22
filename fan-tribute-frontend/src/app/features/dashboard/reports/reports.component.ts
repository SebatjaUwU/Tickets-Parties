import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Reportes</h1>
        <div class="flex gap-2">
          <button class="btn-ghost text-sm">Descargar PDF</button>
          <button class="btn-secondary text-sm">Exportar Excel</button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (kpi of kpis; track kpi.label) {
          <div class="glass-card rounded-xl p-5">
            <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">{{ kpi.label }}</div>
            <div class="text-2xl font-rajdhani font-bold text-electric-blue">{{ kpi.value }}</div>
            <div [class]="kpi.up ? 'text-green-400' : 'text-red-400'" class="text-xs mt-1">
              {{ kpi.change }}
            </div>
          </div>
        }
      </div>

      <!-- Revenue by payment method -->
      <div class="glass-card rounded-2xl p-6 mb-6">
        <h3 class="text-white font-semibold mb-5">Ingresos por método de pago</h3>
        <div class="space-y-4">
          @for (method of paymentMethods; track method.name) {
            <div>
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-gray-300">{{ method.name }}</span>
                <span class="text-white font-medium">{{ method.amount | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
              <div class="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  [style.width.%]="method.percent"
                  class="h-full rounded-full bg-electric-blue transition-all duration-700"
                ></div>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="glass rounded-2xl p-8 text-center text-gray-400">
        <p class="text-4xl mb-3">📊</p>
        <p>Los reportes con gráficos avanzados estarán disponibles próximamente.</p>
      </div>
    </div>
  `,
})
export class ReportsComponent {
  kpis = [
    { label: 'Ventas totales', value: '$42.5M', change: '+12% este mes', up: true },
    { label: 'Entradas vendidas', value: '3,240', change: '+8% este mes', up: true },
    { label: 'Tasa conversión', value: '3.4%', change: '-0.2% vs ayer', up: false },
    { label: 'Ticket promedio', value: '$85K', change: '+5% este mes', up: true },
  ];

  paymentMethods = [
    { name: 'Tarjeta de crédito (Stripe)', amount: 18500000, percent: 44 },
    { name: 'PSE', amount: 12000000, percent: 28 },
    { name: 'Nequi', amount: 7500000, percent: 18 },
    { name: 'MercadoPago', amount: 3000000, percent: 7 },
    { name: 'Daviplata', amount: 1500000, percent: 3 },
  ];
}
