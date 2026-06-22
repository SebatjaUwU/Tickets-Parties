import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-rajdhani font-bold text-white">Gestión de Usuarios</h1>
      </div>

      <!-- Search -->
      <div class="glass rounded-xl p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar usuarios por nombre, email..."
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-electric-blue transition-colors"
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
            @for (user of mockUsers; track user.email) {
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-5 py-4">
                  <div class="font-medium text-white">{{ user.name }}</div>
                  <div class="text-xs text-gray-400">{{ user.email }}</div>
                </td>
                <td class="px-5 py-4 hidden md:table-cell">
                  <span class="px-2 py-1 rounded-full text-xs font-semibold bg-electric-blue/10 text-electric-blue">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-5 py-4 hidden lg:table-cell">
                  <span [class]="user.active ? 'text-green-400' : 'text-red-400'" class="text-sm">
                    {{ user.active ? 'Activo' : 'Suspendido' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button class="text-electric-blue hover:text-white text-sm transition-colors mr-3">Ver</button>
                  <button class="text-red-400 hover:text-red-300 text-sm transition-colors">
                    {{ user.active ? 'Suspender' : 'Activar' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UsersManagementComponent {
  mockUsers = [
    { name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'client', active: true },
    { name: 'María López', email: 'maria@example.com', role: 'organizer', active: true },
    { name: 'Juan García', email: 'juan@example.com', role: 'client', active: false },
    { name: 'Admin Principal', email: 'admin@fantribute.com', role: 'admin', active: true },
  ];
}
