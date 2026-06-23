# FAN TRIBUTE — Plataforma de Tickets EDM

> La comunidad de música electrónica #1 de Colombia y Latinoamérica.

![Angular](https://img.shields.io/badge/Angular-20-DD0031) ![NestJS](https://img.shields.io/badge/NestJS-11-E0234E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)

Plataforma full-stack para la venta de tickets de eventos de música electrónica, con soporte para pagos reales (Stripe + Wompi), tickets con código QR, sistema de cupones y notificaciones por email.

---

## Requisitos

- Node.js 20+
- Docker & Docker Compose
- Git

---

## Inicio rápido

### 1. Clonar y configurar entorno

```bash
git clone https://github.com/tu-usuario/fan-tribute.git
cd Tickets-Parties

# Copiar el .env de ejemplo al backend
cp fan-tribute-backend/.env.example fan-tribute-backend/.env
# Editar .env con tus credenciales (ver sección Variables de Entorno)
```

### 2. Levantar bases de datos con Docker

```bash
# Solo PostgreSQL y Redis (recomendado para desarrollo)
docker compose up postgres redis -d

# Con herramientas de administración (pgAdmin + Redis Commander)
docker compose --profile dev-tools up -d
```

| Servicio | URL |
|---|---|
| pgAdmin | http://localhost:5050 |
| Redis Commander | http://localhost:8082 |

### 3. Backend

```bash
cd fan-tribute-backend
npm install
npm run start:dev
# API en: http://localhost:3000
# Swagger: http://localhost:3000/docs
```

### 4. Frontend

```bash
cd fan-tribute-frontend
npm install
npm start
# App en: http://localhost:4200
```

### 5. Cargar datos de prueba (seed)

```bash
cd fan-tribute-backend
npm run seed
```

Crea: 20 artistas, 6 eventos con tiers de tickets, 5 blog posts, 3 cupones, usuario admin y usuario de prueba.

| Cuenta | Email | Contraseña |
|---|---|---|
| Admin | admin@fantribute.com | Admin1234! |
| Usuario de prueba | test@fantribute.com | Test1234! |

---

## Variables de entorno

Archivo: `fan-tribute-backend/.env`

### Requeridas para funcionar en local (ya configuradas)

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
DATABASE_URL=postgresql://fan_tribute_user:supersecretpassword@localhost:5432/fan_tribute
REDIS_URL=redis://:redissecret@localhost:6379
JWT_SECRET=<generado>
JWT_REFRESH_SECRET=<generado>
```

### Firebase / Google Login

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Habilita el proveedor **Google** en Authentication → Sign-in methods
3. Ve a Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada
4. Pega los valores en `.env`:

```env
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

En el frontend (`fan-tribute-frontend/src/environments/environment.ts`), la configuración de Firebase ya está incluida — solo actualiza los valores con los de tu proyecto.

### Wompi (pagos Colombia — PSE, Nequi, Daviplata)

1. Registrate en [dashboard.wompi.co](https://dashboard.wompi.co)
2. Ve a **Desarrolladores → Llaves API** y copia las llaves de prueba (`pub_test_` / `prv_test_`)
3. Ve a **Desarrolladores → Integrity** y copia el secreto de integridad sandbox

```env
WOMPI_PUBLIC_KEY=pub_test_XXXXXXXX
WOMPI_PRIVATE_KEY=prv_test_XXXXXXXX
WOMPI_INTEGRITY_SECRET=XXXXXXXX
```

Para webhooks locales, expón el backend con [ngrok](https://ngrok.com):
```bash
npx ngrok http 3000
# Configura en Wompi dashboard → Eventos: https://xxxx.ngrok.io/v1/payments/wompi/callback
```

**Tarjetas de prueba Wompi:**
| Resultado | Número |
|---|---|
| Aprobada | 4242 4242 4242 4242 |
| Rechazada | 4111 1111 1111 1111 |

### Stripe (pagos internacionales)

1. Crea cuenta en [stripe.com](https://stripe.com)
2. Ve a Developers → API Keys (modo Test)

```env
STRIPE_SECRET_KEY=sk_test_XXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX
```

### Email (Resend)

1. Crea cuenta en [resend.com](https://resend.com)
2. Genera un API Key

```env
RESEND_API_KEY=re_XXXXXXXX
RESEND_FROM_EMAIL=noreply@tudominio.com
```

> Sin estas claves configuradas, el sistema funciona en modo mock: los pagos se confirman automáticamente y los emails se loguean en consola (útil para desarrollo local).

---

## Flujo de compra

```
1. Usuario agrega tickets al carrito
2. Clic en "Proceder al pago" → se crea la orden en BD (estado: pending)
3. Página de pago → usuario selecciona método
4. Stripe / Wompi procesa el pago
5. Webhook del gateway llama al backend → orden pasa a completed
6. Backend genera tickets QR y envía email de confirmación
7. Usuario ve página de confirmación con sus tickets
```

> En modo desarrollo (sin claves reales), el backend confirma la orden automáticamente al llamar la API de pago. Si usas Wompi sandbox sin ngrok, la página de confirmación tiene un botón "Verificar estado del pago" que confirma manualmente la orden.

---

## Estructura del proyecto

```
Tickets-Parties/
├── docker-compose.yml
├── fan-tribute-frontend/          # Angular 20 SPA
│   └── src/app/
│       ├── core/
│       │   ├── guards/            # auth, admin, guest
│       │   ├── interceptors/      # auth (JWT headers), error, loading
│       │   └── services/          # auth, events, cart, token, notification
│       ├── shared/
│       │   ├── components/        # navbar, footer, hero, event-card, artist-card
│       │   └── models/            # interfaces TypeScript
│       ├── features/
│       │   ├── home/              # Landing page
│       │   ├── events/            # Listado y detalle de eventos
│       │   ├── artists/           # Top artistas
│       │   ├── blog/              # Blog y artículos
│       │   ├── auth/              # Login, registro, recuperar contraseña
│       │   ├── checkout/          # Carrito → Pago → Confirmación
│       │   ├── mis-entradas/      # Tickets del usuario
│       │   ├── dashboard/         # Panel de administración
│       │   └── profile/           # Perfil de usuario
│       └── store/                 # NgRx: auth, events, artists, blog, cart
│
└── fan-tribute-backend/           # NestJS REST API
    └── src/
        ├── modules/
        │   ├── auth/              # JWT + Firebase Google OAuth
        │   ├── users/             # CRUD de usuarios y roles
        │   ├── events/            # CRUD de eventos con tiers de tickets
        │   ├── artists/           # Artistas y seguimiento
        │   ├── tickets/           # Órdenes + generación de tickets QR + cupones
        │   ├── payments/          # Stripe + Wompi (PSE/Nequi/Daviplata)
        │   ├── blog/              # Blog posts con conteo de vistas
        │   ├── notifications/     # Emails con Resend
        │   ├── analytics/         # WebSockets + métricas
        │   ├── admin/             # Dashboard admin
        │   └── affiliates/        # Programa de afiliados
        ├── common/
        │   ├── guards/            # JwtAuthGuard, RolesGuard
        │   ├── interceptors/      # Transform, Logging
        │   └── decorators/        # @CurrentUser, @Roles, @Public
        └── database/
            └── seeds/seed.ts      # Script de datos iniciales
```

---

## API — Endpoints principales

Base URL: `http://localhost:3000/v1`  
Documentación interactiva: `http://localhost:3000/docs`

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro con email/contraseña |
| POST | `/auth/login` | Login con email/contraseña |
| POST | `/auth/google` | Login con token de Google/Firebase |
| POST | `/auth/refresh` | Renovar access token |
| POST | `/auth/logout` | Cerrar sesión |

### Eventos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/events` | Listar eventos (con filtros) |
| GET | `/events/featured` | Eventos destacados |
| GET | `/events/:id` | Detalle de evento |

### Tickets y órdenes
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/tickets/orders` | Crear orden |
| GET | `/tickets/orders/:id` | Detalle de orden |
| GET | `/tickets/my-tickets` | Mis tickets |
| POST | `/tickets/validate-qr` | Validar QR en entrada |

### Pagos
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/payments/stripe/intent` | Crear PaymentIntent de Stripe |
| POST | `/payments/wompi/initiate` | Iniciar pago con Wompi |
| POST | `/payments/dev/confirm/:orderId` | [Solo dev] Confirmar orden manualmente |

### Cupones
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/tickets/coupons/validate` | Validar cupón |

### Blog
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/blog/posts` | Listar posts |
| GET | `/blog/posts/featured` | Posts destacados |
| GET | `/blog/posts/:slug` | Post por slug |

---

## Funcionalidades implementadas

- **Autenticación**: registro por email (con cédula y celular), login, Google OAuth via Firebase, JWT con refresh tokens, verificación de email, restauración de sesión al recargar
- **Catálogo**: eventos con tiers de tickets (General / VIP / Platinum), artistas con rankings y géneros
- **Carrito**: persistencia en NgRx store, service fee del 5%, cupones de descuento
- **Cupones**: tipo porcentaje y monto fijo, límite de usos, fechas de vigencia, monto mínimo de compra
- **Pagos**: Stripe (tarjeta) y Wompi (PSE, Nequi, Daviplata), modo mock para desarrollo sin claves
- **Tickets QR**: generación automática al confirmar pago, código QR en base64 embebido en email
- **Emails transaccionales**: confirmación de orden con tickets QR adjuntos, verificación de email con token JWT, recuperación de contraseña (via Resend)
- **Blog**: posts con conteo de vistas, posts destacados, búsqueda por slug
- **Dashboard admin**: gestión completa de eventos (crear, editar, publicar, eliminar), gestión de usuarios y reportes
- **Política sin reembolsos**: el sistema no contempla devoluciones de dinero

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 20, NgRx 20, TailwindCSS 3.4, TypeScript 5.5 |
| Backend | NestJS 11, TypeORM 0.3, TypeScript |
| Base de datos | PostgreSQL 16 |
| Caché / Colas | Redis 7, BullMQ 4 |
| Auth | Firebase Auth, Google OAuth, JWT RS256 |
| Pagos | Stripe 14, Wompi (sandbox + producción) |
| Email | Resend 4 |
| Tiempo real | Socket.io 11 (WebSockets) |
| Contenedores | Docker + Docker Compose |
| Docs | Swagger / OpenAPI |

---

## Deploy en producción

| Componente | Plataforma recomendada |
|---|---|
| Frontend | Vercel / Netlify |
| Backend API | Railway / Render |
| Base de datos | Neon / Supabase / Railway PostgreSQL |
| Redis | Upstash |
| Auth | Firebase |
| Email | Resend |
| Pagos Colombia | Wompi producción (`pub_prod_` / `prv_prod_`) |
| Pagos internacional | Stripe producción |

Para producción, asegúrate de:
1. Cambiar `NODE_ENV=production` en `.env`
2. Usar llaves de producción de Wompi y Stripe
3. Configurar el webhook de Wompi apuntando a tu dominio real
4. Configurar CORS en el backend con tu dominio de frontend

---

**Hecho para la comunidad EDM de Colombia**
