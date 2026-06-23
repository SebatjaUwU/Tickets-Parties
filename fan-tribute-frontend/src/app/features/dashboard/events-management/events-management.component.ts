import { Component, OnInit, OnDestroy, inject, signal, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { EventsActions } from '../../../store/events/events.actions';
import { selectAllEventsEntities, selectEventsLoading } from '../../../store/events/events.selectors';
import { Event } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-events-management',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Gestión de Eventos</h1>
        <button (click)="openCreate()" class="btn-primary text-sm">+ Nuevo evento</button>
      </div>

      <!-- Tabla -->
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
                      {{ statusLabel(event.status) }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right space-x-3">
                    @if (event.status === 'draft') {
                      <button (click)="publish(event)" class="text-green-400 hover:text-green-300 text-sm transition-colors">Publicar</button>
                    }
                    <button (click)="openEdit(event)" class="text-electric-blue hover:text-white text-sm transition-colors">Editar</button>
                    <button (click)="confirmDelete(event)" class="text-red-400 hover:text-red-300 text-sm transition-colors">Eliminar</button>
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

    <!-- Modal crear/editar -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" (click)="closeModal()">
        <div class="glass-card rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-rajdhani font-bold text-white mb-5">
            {{ editingId() ? 'Editar evento' : 'Nuevo evento' }}
          </h2>

          @if (modalError()) {
            <div class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{{ modalError() }}</div>
          }

          <form [formGroup]="eventForm" (ngSubmit)="saveEvent()" class="space-y-4">

            <div>
              <label class="block text-sm text-gray-300 mb-1">Nombre del evento *</label>
              <input formControlName="title" type="text" placeholder="Ej: Ultra Music Festival 2026"
                class="input-field w-full" />
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-1">Descripción</label>
              <textarea formControlName="description" rows="3" placeholder="Descripción del evento..."
                class="input-field w-full resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-300 mb-1">Fecha y hora *</label>
                <input formControlName="date" type="datetime-local" class="input-field w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-1">Fecha fin</label>
                <input formControlName="endDate" type="datetime-local" class="input-field w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-300 mb-1">Género musical</label>
                <select formControlName="genre" class="input-field w-full">
                  <option value="">Seleccionar</option>
                  <option value="Techno">Techno</option>
                  <option value="House">House</option>
                  <option value="Trance">Trance</option>
                  <option value="EDM">EDM</option>
                  <option value="Reggaeton">Reggaeton</option>
                  <option value="Electronic">Electronic</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-1">Capacidad</label>
                <input formControlName="capacity" type="number" min="0" placeholder="Ej: 5000"
                  class="input-field w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-300 mb-1">Lugar / Venue</label>
                <input formControlName="venue" type="text" placeholder="Ej: Movistar Arena"
                  class="input-field w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-1">Ciudad</label>
                <input formControlName="city" type="text" placeholder="Ej: Bogotá"
                  class="input-field w-full" />
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-1">País</label>
              <input formControlName="country" type="text" placeholder="Ej: Colombia"
                class="input-field w-full" />
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-ghost flex-1">Cancelar</button>
              <button type="submit" [disabled]="eventForm.invalid || saving()"
                class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                @if (saving()) { Guardando... } @else { {{ editingId() ? 'Guardar cambios' : 'Crear evento' }} }
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Modal confirmar eliminación -->
    @if (deleteTarget()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" (click)="deleteTarget.set(null)">
        <div class="glass-card rounded-2xl p-6 w-full max-w-sm text-center" (click)="$event.stopPropagation()">
          <p class="text-4xl mb-3">⚠️</p>
          <h3 class="text-lg font-bold text-white mb-2">¿Eliminar evento?</h3>
          <p class="text-gray-400 text-sm mb-6">
            Se eliminará <span class="text-white font-medium">{{ deleteTarget()!.title }}</span> de forma permanente.
          </p>
          <div class="flex gap-3">
            <button (click)="deleteTarget.set(null)" class="btn-ghost flex-1">Cancelar</button>
            <button (click)="deleteEvent()" [disabled]="saving()" class="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold disabled:opacity-50 transition-colors">
              @if (saving()) { Eliminando... } @else { Eliminar }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .input-field {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      color: #fff;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
    }
    .input-field:focus { border-color: #00d4ff; }
    .input-field option { background: #1a1a2e; }
  `],
})
export class EventsManagementComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  events = this.store.selectSignal<Event[]>(selectAllEventsEntities);
  loading = this.store.selectSignal(selectEventsLoading);

  showModal = signal(false);
  editingId = signal<string | null>(null);
  deleteTarget = signal<Event | null>(null);
  saving = signal(false);
  modalError = signal<string | null>(null);

  eventForm = this.fb.group({
    title:       ['', Validators.required],
    description: [''],
    date:        ['', Validators.required],
    endDate:     [''],
    genre:       [''],
    venue:       [''],
    city:        [''],
    country:     ['Colombia'],
    capacity:    [0],
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showModal()) this.closeModal();
    else if (this.deleteTarget()) this.deleteTarget.set(null);
  }

  ngOnInit(): void {
    this.store.dispatch(EventsActions.loadEvents({}));
  }

  ngOnDestroy(): void {
    this.unlockScroll();
  }

  private lockScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    document.body.style.overflow = '';
  }

  openCreate(): void {
    this.editingId.set(null);
    this.eventForm.reset({ country: 'Colombia', capacity: 0 });
    this.modalError.set(null);
    this.showModal.set(true);
    this.lockScroll();
  }

  openEdit(event: Event): void {
    this.lockScroll();
    this.editingId.set(event.id);
    this.eventForm.patchValue({
      title:       event.title,
      description: event.description ?? '',
      date:        event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      genre:       (event.genres?.[0] ?? ''),
      venue:       (event as any).venue ?? '',
      city:        (event as any).city ?? '',
      country:     (event as any).country ?? 'Colombia',
      capacity:    (event as any).capacity ?? 0,
    });
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.unlockScroll();
  }

  saveEvent(): void {
    if (this.eventForm.invalid || this.saving()) return;
    this.saving.set(true);
    this.modalError.set(null);

    const id = this.editingId();
    const body = this.eventForm.value;
    const req = id
      ? this.http.put(`${environment.apiUrl}/events/${id}`, body)
      : this.http.post(`${environment.apiUrl}/events`, body);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.store.dispatch(EventsActions.loadEvents({}));
      },
      error: (err) => {
        this.saving.set(false);
        this.modalError.set(err?.error?.message ?? 'Error al guardar el evento.');
      },
    });
  }

  confirmDelete(event: Event): void {
    this.deleteTarget.set(event);
    this.lockScroll();
  }

  deleteEvent(): void {
    const event = this.deleteTarget();
    if (!event) return;
    this.saving.set(true);
    this.http.delete(`${environment.apiUrl}/events/${event.id}`).subscribe({
      next: () => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        this.unlockScroll();
        this.store.dispatch(EventsActions.loadEvents({}));
      },
      error: (err) => {
        this.saving.set(false);
        this.modalError.set(err?.error?.message ?? 'Error al eliminar el evento.');
      },
    });
  }

  publish(event: Event): void {
    this.http.patch(`${environment.apiUrl}/events/${event.id}/publish`, {}).subscribe({
      next: () => this.store.dispatch(EventsActions.loadEvents({})),
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      published: 'bg-green-500/20 text-green-400',
      draft:     'bg-gray-500/20 text-gray-400',
      cancelled: 'bg-red-500/20 text-red-400',
      sold_out:  'bg-orange-500/20 text-orange-400',
    };
    return map[status] ?? 'bg-gray-500/20 text-gray-400';
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft:     'Borrador',
      cancelled: 'Cancelado',
      sold_out:  'Agotado',
    };
    return labels[status] ?? status;
  }
}
