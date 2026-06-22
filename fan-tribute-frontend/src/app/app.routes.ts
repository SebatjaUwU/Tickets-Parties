import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { organizerGuard } from './core/guards/organizer.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Main layout routes
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'FAN TRIBUTE — La Comunidad EDM',
      },
      {
        path: 'eventos',
        loadComponent: () => import('./features/events/event-list/event-list.component').then(m => m.EventListComponent),
        title: 'Eventos EDM | FAN TRIBUTE',
      },
      {
        path: 'eventos/:slug',
        loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent),
        title: 'Detalle del Evento | FAN TRIBUTE',
      },
      {
        path: 'artistas',
        loadComponent: () => import('./features/artists/artists.component').then(m => m.ArtistsComponent),
        title: 'Top 20 Artistas EDM | FAN TRIBUTE',
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
        title: 'Blog & Noticias EDM | FAN TRIBUTE',
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./features/blog/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
        title: 'Artículo | FAN TRIBUTE',
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
        title: 'Nosotros | FAN TRIBUTE',
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contacto | FAN TRIBUTE',
      },
      // Protected routes
      {
        path: 'perfil',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        title: 'Mi Perfil | FAN TRIBUTE',
      },
      {
        path: 'mis-entradas',
        loadComponent: () => import('./features/mis-entradas/mis-entradas.component').then(m => m.MisEntradasComponent),
        canActivate: [authGuard],
        title: 'Mis Entradas | FAN TRIBUTE',
      },
      {
        path: 'checkout',
        children: [
          {
            path: 'carrito',
            loadComponent: () => import('./features/checkout/cart/cart.component').then(m => m.CartComponent),
            canActivate: [authGuard],
            title: 'Carrito | FAN TRIBUTE',
          },
          {
            path: 'pago',
            loadComponent: () => import('./features/checkout/payment/payment.component').then(m => m.PaymentComponent),
            canActivate: [authGuard],
            title: 'Pago | FAN TRIBUTE',
          },
          {
            path: 'confirmacion/:orderId',
            loadComponent: () => import('./features/checkout/confirmation/confirmation.component').then(m => m.ConfirmationComponent),
            canActivate: [authGuard],
            title: 'Confirmación | FAN TRIBUTE',
          },
        ],
      },
    ],
  },

  // Auth layout routes
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Iniciar Sesión | FAN TRIBUTE',
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Registrarse | FAN TRIBUTE',
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Recuperar Contraseña | FAN TRIBUTE',
      },
    ],
  },

  // Dashboard routes
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard, organizerGuard],
    children: [
      {
        path: '',
        redirectTo: 'resumen',
        pathMatch: 'full',
      },
      {
        path: 'resumen',
        loadComponent: () => import('./features/dashboard/overview/overview.component').then(m => m.OverviewComponent),
        title: 'Dashboard | FAN TRIBUTE',
      },
      {
        path: 'eventos',
        loadComponent: () => import('./features/dashboard/events-management/events-management.component').then(m => m.EventsManagementComponent),
        title: 'Gestión de Eventos | Dashboard',
      },
      {
        path: 'entradas',
        loadComponent: () => import('./features/dashboard/tickets-management/tickets-management.component').then(m => m.TicketsManagementComponent),
        title: 'Gestión de Entradas | Dashboard',
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/dashboard/users-management/users-management.component').then(m => m.UsersManagementComponent),
        canActivate: [adminGuard],
        title: 'Gestión de Usuarios | Dashboard',
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/dashboard/reports/reports.component').then(m => m.ReportsComponent),
        title: 'Reportes | Dashboard',
      },
    ],
  },

  // Fallback
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página no encontrada | FAN TRIBUTE',
  },
];
