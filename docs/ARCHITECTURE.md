# FAN TRIBUTE — Arquitectura Completa

## Visión General

FAN TRIBUTE es una plataforma web full-stack para la comunidad EDM (Electronic Dance Music), construida con una arquitectura moderna de microservicios orientada a producción.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTES                                    │
│   Browser (PWA)  │  Mobile (Futuro)  │  Admin Dashboard             │
└──────────┬──────────────┬────────────────────┬───────────────────────┘
           │              │                    │
           ▼              ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                                 │
│              DDoS Protection + SSL + Cache                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────────┐
           ▼               ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   VERCEL     │  │   RAILWAY    │  │   AWS S3         │
│  (Frontend)  │  │  (Backend)   │  │  (Media Storage) │
│  Angular 20  │  │   NestJS     │  │  Images/Videos   │
│  SSR/SSG     │  │   REST API   │  │  Tickets PDF     │
└──────────────┘  └──────┬───────┘  └──────────────────┘
                         │
           ┌─────────────┼─────────────────────┐
           ▼             ▼                     ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────────┐
│    NEON      │ │   REDIS      │  │  FIREBASE AUTH   │
│ PostgreSQL   │ │   Cache +    │  │  Google OAuth    │
│  (Database)  │ │   Sessions   │  │  JWT Tokens      │
└──────────────┘ └──────────────┘  └──────────────────┘
```

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| Angular | 20.x | Framework principal SPA/SSR |
| TypeScript | 5.5+ | Tipado estático |
| TailwindCSS | 3.4+ | Estilos utility-first |
| Angular Material | 18+ | Componentes UI |
| NgRx | 18+ | Gestión de estado global |
| Chart.js + ApexCharts | Latest | Gráficas del dashboard |
| Angular PWA | 20.x | Progressive Web App |
| i18n (Angular) | 20.x | Multiidioma ES/EN |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| NestJS | 11.x | Framework Node.js |
| TypeScript | 5.5+ | Tipado estático |
| TypeORM | 0.3+ | ORM para PostgreSQL |
| PostgreSQL | 16 | Base de datos principal |
| Redis | 7+ | Cache y sesiones |
| JWT | Latest | Autenticación stateless |
| Passport.js | Latest | Estrategias de auth |
| BullMQ | Latest | Queue de jobs (emails, notif.) |
| Socket.io | 4+ | Tiempo real (stats, chat) |
| Swagger | Latest | Documentación API |

### Servicios Externos
| Servicio | Propósito |
|---|---|
| Firebase Auth | Google OAuth + 2FA |
| Stripe | Pagos internacionales |
| MercadoPago | Pagos Colombia/LATAM |
| Wompi | PSE, Nequi, Daviplata Colombia |
| AWS S3 | Almacenamiento de medios |
| Cloudflare | CDN + protección DDoS |
| Resend | Transactional emails |
| Google Analytics 4 | Analítica web |
| Google Maps API | Mapas en eventos |
| Spotify API | Integración música |
| Instagram API | Social media |

## Principios de Arquitectura

1. **Clean Architecture**: Separación clara de capas (Domain, Application, Infrastructure)
2. **SOLID**: Single responsibility, Open/closed, Liskov, Interface segregation, Dependency inversion
3. **DRY / KISS**: Sin duplicación, código simple y legible
4. **API-First**: Backend totalmente desacoplado del frontend
5. **Security-by-default**: JWT, CSRF, XSS, Rate Limiting desde el inicio
6. **Mobile-First**: Diseño responsive empezando desde 320px
7. **Performance**: Lazy loading, code splitting, cache agresivo
8. **Observability**: Logs estructurados, métricas, health checks

## Patrones de Diseño Utilizados

- **Repository Pattern**: Abstracción de acceso a datos
- **Factory Pattern**: Creación de entidades complejas
- **Strategy Pattern**: Métodos de pago intercambiables
- **Observer Pattern**: Eventos del sistema (WebSockets)
- **Decorator Pattern**: Guards y roles de usuario
- **Command Pattern**: NgRx Actions
- **Facade Pattern**: NgRx Facades
