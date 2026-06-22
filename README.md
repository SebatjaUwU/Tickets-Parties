# 🎵 FAN TRIBUTE — Plataforma EDM

> La comunidad de música electrónica #1 de Colombia y Latinoamérica.

![FAN TRIBUTE](https://img.shields.io/badge/version-1.0.0-blue) ![Angular](https://img.shields.io/badge/Angular-20-red) ![NestJS](https://img.shields.io/badge/NestJS-11-e0234e) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6)

## 🚀 Quick Start

### Prerrequisitos
- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clonar y configurar
```bash
git clone https://github.com/tu-usuario/fan-tribute.git
cd fan-tribute
cp .env.example .env
# Editar .env con tus credenciales reales
```

### 2. Levantar con Docker (recomendado)
```bash
# Solo bases de datos y redis
docker compose up postgres redis -d

# Con herramientas de desarrollo (pgAdmin, Redis Commander)
docker compose --profile dev-tools up -d
```

### 3. Frontend
```bash
cd fan-tribute-frontend
npm install
npm start
# → http://localhost:4200
```

### 4. Backend
```bash
cd fan-tribute-backend
npm install
npm run start:dev
# → http://localhost:3000
# → Swagger: http://localhost:3000/docs
```

---

## 📁 Estructura del Proyecto

```
fan-tribute/
├── 📄 docker-compose.yml          # Orquestación de servicios
├── 📄 .env.example                # Variables de entorno ejemplo
├── 📄 .gitignore
│
├── 📁 docs/
│   ├── ARCHITECTURE.md            # Arquitectura completa del sistema
│   ├── DATABASE_SCHEMA.sql        # Schema PostgreSQL completo
│   ├── API_DOCS.md                # Documentación REST API
│   └── ROADMAP.md                 # Roadmap de desarrollo
│
├── 📁 fan-tribute-frontend/       # Angular 20 SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # Guards, interceptors, services
│   │   │   │   ├── guards/        # auth, admin, organizer, guest
│   │   │   │   ├── interceptors/  # auth, error, loading
│   │   │   │   └── services/      # auth, events, cart, token, notification
│   │   │   ├── shared/
│   │   │   │   ├── components/    # navbar, footer, hero, event-card, artist-card...
│   │   │   │   ├── models/        # TypeScript interfaces completas
│   │   │   │   ├── pipes/
│   │   │   │   └── directives/
│   │   │   ├── features/
│   │   │   │   ├── home/          # Landing page + estadísticas
│   │   │   │   ├── events/        # Listado + detalle + filtros
│   │   │   │   ├── artists/       # Top 20 carrusel
│   │   │   │   ├── blog/          # Blog + artículos
│   │   │   │   ├── auth/          # Login + registro + recuperación
│   │   │   │   ├── checkout/      # Carrito + pago + confirmación
│   │   │   │   ├── dashboard/     # Admin: overview, eventos, entradas, usuarios, reportes
│   │   │   │   ├── profile/       # Perfil de usuario
│   │   │   │   ├── about/         # Nosotros
│   │   │   │   └── contact/       # Contacto + mapa
│   │   │   ├── store/             # NgRx (auth, events, artists, blog, cart)
│   │   │   ├── layouts/           # main, auth, dashboard
│   │   │   └── app.routes.ts      # Lazy loading routing
│   │   ├── environments/          # dev / prod
│   │   └── styles/                # SCSS variables + global styles
│   ├── tailwind.config.js         # Tema EDM personalizado
│   └── package.json
│
└── 📁 fan-tribute-backend/        # NestJS REST API
    ├── src/
    │   ├── main.ts                # Bootstrap con Swagger, Helmet, CORS
    │   ├── app.module.ts          # Módulo raíz
    │   ├── modules/
    │   │   ├── auth/              # JWT + Google OAuth + 2FA
    │   │   ├── users/             # CRUD + roles + puntos
    │   │   ├── events/            # CRUD + publicar + upload
    │   │   ├── artists/           # Top 20 + seguir
    │   │   ├── tickets/           # Generación QR + PDF + validación
    │   │   ├── payments/          # Stripe + MercadoPago + Wompi
    │   │   ├── blog/              # CRUD + categorías + comentarios
    │   │   ├── notifications/     # Email (Resend) + push
    │   │   ├── analytics/         # WebSockets + métricas tiempo real
    │   │   ├── admin/             # Dashboard + reportes Excel/PDF
    │   │   └── affiliates/        # Programa de afiliados
    │   ├── common/
    │   │   ├── guards/            # JwtAuthGuard, RolesGuard
    │   │   ├── interceptors/      # Transform, Logging
    │   │   ├── filters/           # AllExceptions
    │   │   └── decorators/        # @CurrentUser, @Roles, @Public
    │   └── config/                # Database, Redis config
    └── package.json
```

---

## 🎨 Stack & Tecnologías

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Angular 20, TypeScript 5.5, TailwindCSS 3.4, NgRx 20 |
| **UI** | Angular Material, ApexCharts, Chart.js |
| **Backend** | NestJS 11, TypeORM, PostgreSQL 16 |
| **Auth** | Firebase Auth, JWT, Google OAuth 2.0, 2FA TOTP |
| **Pagos** | Stripe, MercadoPago, Wompi (PSE/Nequi/Daviplata) |
| **Storage** | AWS S3 + Cloudflare CDN |
| **Real-time** | Socket.io WebSockets |
| **Email** | Resend API |
| **Queue** | BullMQ + Redis |
| **Docs** | Swagger/OpenAPI |

---

## 💳 Métodos de Pago

### Colombia
- ✅ PSE (Bancario)
- ✅ Nequi
- ✅ Daviplata
- ✅ Tarjeta Crédito/Débito

### Internacional
- ✅ Stripe (todas las tarjetas)
- ✅ PayPal

---

## 🗺️ Roadmap

Ver [`docs/ROADMAP.md`](docs/ROADMAP.md) para el plan completo.

**MVP (8 semanas):** Auth + Landing + Eventos + Checkout + Tickets QR  
**Beta (6 semanas):** Blog + Dashboard avanzado + Afiliados  
**V1.0 (4 semanas):** Puntos + PWA + Multiidioma + SEO  
**V2.0:** App móvil + IA + Chat en vivo  

---

## 🔐 Seguridad

- JWT con refresh tokens
- Rate limiting por IP
- Protección CSRF
- Helmet.js (headers seguros)
- SSL/HTTPS obligatorio
- QR tickets encriptados con HMAC-SHA256
- 2FA opcional con TOTP

---

## 📊 Base de Datos

Ver [`docs/DATABASE_SCHEMA.sql`](docs/DATABASE_SCHEMA.sql) para el schema completo.

**Tablas principales:**
`users` · `events` · `venues` · `artists` · `ticket_tiers` · `tickets` · `orders` · `payments` · `blog_posts` · `coupons` · `affiliates` · `point_transactions` · `notifications`

---

## 🌍 Deploy en Producción

| Servicio | Plataforma |
|---------|-----------|
| Frontend | Vercel |
| Backend API | Railway |
| Base de datos | Neon PostgreSQL |
| Media Storage | AWS S3 |
| CDN | Cloudflare |
| Auth | Firebase |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

---

**Hecho con ❤️ para la comunidad EDM de Colombia y el mundo** 🎵
# Tickets-Parties
