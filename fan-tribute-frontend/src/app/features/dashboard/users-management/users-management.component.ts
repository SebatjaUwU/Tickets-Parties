import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { User } from '../../../shared/models';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Gestión de Usuarios</h1>
        <button (click)="loadUsers()" class="btn-ghost text-sm px-4 py-2" [disabled]="loading()">
          @if (loading()) { Cargando... } @else { ↻ Actualizar }
        </button>
      </div>

      <!-- Search -->
      <div class="glass rounded-xl p-4 mb-6">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Buscar usuarios por nombre, email..."
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue-500 transition-colors"
        />
      </div>

      <!-- Users table -->
      <div class="glass rounded-2xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Rol</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Estado</th>
              <th class="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @if (loading()) {
              @for (i of [1,2,3,4,5]; track i) {
                <tr class="animate-pulse">
                  <td class="px-5 py-4"><div class="h-4 bg-white/5 rounded w-3/4 mb-1"></div><div class="h-3 bg-white/5 rounded w-1/2"></div></td>
                  <td class="px-5 py-4 hidden md:table-cell"><div class="h-4 bg-white/5 rounded w-16"></div></td>
                  <td class="px-5 py-4 hidden lg:table-cell"><div class="h-4 bg-white/5 rounded w-12"></div></td>
                  <td class="px-5 py-4"></td>
                </tr>
              }
            } @else if (filteredUsers().length === 0) {
              <tr>
                <td colspan="4" class="px-5 py-12 text-center text-gray-400">
                  @if (searchQuery) { No se encontraron usuarios para "{{ searchQuery }}" }
                  @else { No hay usuarios registrados }
                </td>
              </tr>
            } @else {
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        [style.background]="avatarGradient(user)">
                        {{ initials(user) }}
                      </div>
                      <div>
                        <div class="font-medium text-white">{{ user.firstName }} {{ user.lastName }}</div>
                        <div class="text-xs text-gray-400">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4 hidden md:table-cell">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                      [class.bg-purple-500]="user.role === 'super_admin'"
                      [class.text-purple-300]="user.role === 'super_admin'"
                      [class.bg-electric-blue-500]="user.role === 'admin'"
                      [class.text-electric-blue-300]="user.role === 'admin'"
                      [class.bg-orange-500]="user.role === 'organizer'"
                      [class.text-orange-300]="user.role === 'organizer'"
                      [class.bg-white]="user.role === 'client'"
                      [class.bg-opacity-10]="true"
                      [class.text-gray-300]="user.role === 'client'"
                    >
                      {{ roleLabel(user.role) }}
                    </span>
                  </td>
                  <td class="px-5 py-4 hidden lg:table-cell">
                    <span [class]="user.status === 'active' ? 'text-green-400' : user.status === 'banned' ? 'text-red-400' : 'text-yellow-400'" class="text-sm">
                      {{ statusLabel(user.status) }}
                    </span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button
                      (click)="toggleStatus(user)"
                      [disabled]="togglingId() === user.id"
                      class="text-sm transition-colors disabled:opacity-50"
                      [class.text-red-400]="user.status === 'active'"
                      [class.hover:text-red-300]="user.status === 'active'"
                      [class.text-green-400]="user.status !== 'active'"
                      [class.hover:text-green-300]="user.status !== 'active'"
                    >
                      @if (togglingId() === user.id) { Cambiando... }
                      @else if (user.status === 'active') { Suspender }
                      @else { Activar }
                    </button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (total() > 0) {
        <p class="text-gray-500 text-xs mt-4 text-right">{{ filteredUsers().length }} de {{ total() }} usuarios</p>
      }
    </div>
  `,
})
export class UsersManagementComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  users  = signal<User[]>([]);
  loading = signal(false);
  togglingId = signal<string | null>(null);
  total  = signal(0);
  searchQuery = '';

  filteredUsers = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/users?limit=200`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          const list = Array.isArray(res) ? res : (res.data ?? []);
          this.users.set(list);
          this.total.set(res.total ?? list.length);
        },
        error: () => { this.loading.set(false); },
      });
  }

  toggleStatus(user: User): void {
    if (this.togglingId()) return;
    this.togglingId.set(user.id);
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    this.http.patch(`${environment.apiUrl}/users/${user.id}/status`, { status: newStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.togglingId.set(null);
          this.users.update(list => list.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
        },
        error: () => { this.togglingId.set(null); },
      });
  }

  initials(user: User): string {
    const f = user.firstName?.[0]?.toUpperCase() ?? '';
    const l = user.lastName?.[0]?.toUpperCase() ?? '';
    return (f + l) || (user.email?.[0]?.toUpperCase() ?? '?');
  }

  avatarGradient(user: User): string {
    const seed = user.id ?? user.email ?? 'x';
    const hue  = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 60) % 360},70%,30%))`;
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      super_admin: 'Super Admin',
      admin:       'Admin',
      organizer:   'Organizador',
      client:      'Cliente',
    };
    return map[role] ?? role;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      active:               'Activo',
      inactive:             'Inactivo',
      banned:               'Suspendido',
      pending_verification: 'Pendiente',
    };
    return map[status] ?? status;
  }
}
