import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { EventsActions } from '../../../store/events/events.actions';
import { selectAllEventsEntities, selectEventsLoading } from '../../../store/events/events.selectors';
import { Event } from '../../../shared/models';

@Component({
  selector: 'app-events-management',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Gestión de Eventos</h1>
        <button class="btn-primary text-sm">+ Nuevo evento</button>
      </div>

      <div class="glass rounded-2xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Evento</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Ciudad</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @if (loading()) {
              @for (item of [1,2,3,4,5]; track item) {
                <tr class="animate-pulse">
                  <td class="px-5 py-4"><div class="h-4 bg-white/5 rounded w-3/4"></div></td>
                  <td class="px-5 py-4 hidden md:table-cell"><div class="h-4 bg-white/5 rounded w-1/2"></div></td>
                  <td class="px-5 py-4 hidden lg:table-cell"><div class="h-4 bg-white/5 rounded w-1/3"></div></td>
                  <td class="px-5 py-4"><div class="h-4 bg-white/5 rounded w-1/4"></div></td>
                  <td class="px-5 py-4"></td>
                </tr>
              }
            } @else {
              @for (event of events(); track event.id) {
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="px-5 py-4">
                    <div class="font-medium text-white">{{ event.title }}</div>
                    <div class="text-xs text-gray-400">{{ event.slug }}</div>
                  </td>
                  <td class="px-5 py-4 text-sm text-gray-300 hidden md:table-cell">
                    {{ event.startDate | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-5 py-4 text-sm text-gray-300 hidden lg:table-cell">
                    {{ event.venue?.city ?? '—' }}
                  </td>
                  <td class="px-5 py-4">
                    <span [class]="getStatusClass(event.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ event.status }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-electric-blue hover:text-white text-sm transition-colors mr-3">Editar</button>
                    <button class="text-red-400 hover:text-red-300 text-sm transition-colors">Eliminar</button>
                  </td>
                </tr>
              }
              @if (events().length === 0) {
                <tr>
                  <td colspan="5" class="px-5 py-12 text-center text-gray-400">No hay eventos registrados</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class EventsManagementComponent implements OnInit {
  private readonly store = inject(Store);

  events = this.store.selectSignal<Event[]>(selectAllEventsEntities);
  loading = this.store.selectSignal(selectEventsLoading);

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents({}));
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      published: 'bg-green-500/20 text-green-400',
      draft: 'bg-gray-500/20 text-gray-400',
      cancelled: 'bg-red-500/20 text-red-400',
      sold_out: 'bg-orange-500/20 text-orange-400',
    };
    return map[status] ?? 'bg-gray-500/20 text-gray-400';
  }
}
