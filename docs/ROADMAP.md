# FAN TRIBUTE — Roadmap de Desarrollo

## Resumen Ejecutivo

| Fase | Duración | Estado | Enfoque |
|------|----------|--------|---------|
| MVP | 8 semanas | 🔧 En progreso | Core: Auth, Eventos, Tickets, Pagos |
| Beta | 6 semanas | 📋 Planeado | Blog, Dashboard avanzado, Afiliados |
| V1.0 | 4 semanas | 📋 Planeado | Puntos, PWA, SEO, Multiidioma |
| V2.0 | TBD | 🔮 Futuro | App móvil, IA, Chat en vivo |

---

## FASE 1 — MVP (Semanas 1-8)

### Semana 1: Setup & Base
- [x] Diseño del sistema y arquitectura
- [x] Schema de base de datos PostgreSQL
- [x] Documentación API
- [ ] Setup Angular 20 con routing y módulos
- [ ] Setup NestJS con TypeORM y Swagger
- [ ] Configuración Docker y variables de entorno
- [ ] Diseño sistema (colores, tipografía, tokens)
- [ ] Componentes base (navbar, footer, hero)

### Semana 2: Autenticación
- [ ] Registro con email/contraseña
- [ ] Login con email/contraseña
- [ ] Google OAuth via Firebase
- [ ] Verificación de email
- [ ] Recuperación de contraseña
- [ ] JWT access + refresh tokens
- [ ] Guards de rutas Angular
- [ ] Store NgRx para auth

### Semana 3: Landing Page & Home
- [ ] Hero Section con video de fondo
- [ ] Estadísticas animadas
- [ ] Eventos destacados (cards)
- [ ] Noticias recientes
- [ ] Newsletter suscripción
- [ ] Sección de artistas (preview)
- [ ] Footer completo
- [ ] Página Nosotros

### Semana 4: Artistas
- [ ] Listado Top 20 EDM con carrusel
- [ ] Detalle de artista
- [ ] Integración Spotify (canciones)
- [ ] Seguir/dejar de seguir artistas
- [ ] Cards con redes sociales
- [ ] Géneros y filtros

### Semana 5: Eventos & Búsqueda
- [ ] Listado de eventos con filtros
- [ ] Búsqueda en tiempo real
- [ ] Detalle del evento completo
- [ ] Mapa con Google Maps
- [ ] Galería de imágenes
- [ ] Lineup de artistas
- [ ] Tiers de entradas

### Semana 6: Tickets & Checkout
- [ ] Selección de entradas (cantidad)
- [ ] Reserva temporal (15 min)
- [ ] Formulario de datos del asistente
- [ ] Aplicar cupones de descuento
- [ ] Página de checkout
- [ ] Integración Stripe (tarjetas internacionales)
- [ ] Integración Wompi (Colombia: PSE, Nequi, Daviplata)
- [ ] Confirmación de compra
- [ ] Ticket digital con QR
- [ ] PDF descargable
- [ ] Email de confirmación

### Semana 7: Dashboard Admin (básico)
- [ ] Layout dashboard
- [ ] Métricas overview (KPIs)
- [ ] Gestión de eventos (CRUD)
- [ ] Gestión de ticket tiers
- [ ] Lista de órdenes
- [ ] Validador QR (scanner)

### Semana 8: Testing, Deploy & SEO
- [ ] Tests unitarios (>70% coverage)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] SEO meta tags y sitemap
- [ ] Performance optimization
- [ ] Deploy Frontend → Vercel
- [ ] Deploy Backend → Railway
- [ ] Deploy DB → Neon PostgreSQL
- [ ] Setup Cloudflare CDN
- [ ] Monitoreo con Sentry

---

## FASE 2 — Beta (Semanas 9-14)

### Semana 9-10: Blog & Noticias
- [ ] CRUD blog admin
- [ ] Listado con categorías y tags
- [ ] Artículo individual con SEO
- [ ] Comentarios y likes
- [ ] Share en redes sociales
- [ ] Artículos relacionados

### Semana 11-12: Dashboard Avanzado
- [ ] Gráficas con ApexCharts
- [ ] Ventas en tiempo real (WebSockets)
- [ ] Gestión de usuarios (admin)
- [ ] Reportes exportables (Excel/PDF)
- [ ] Métricas por evento detalladas
- [ ] Gestión de cupones

### Semana 13: Perfil & Favoritos
- [ ] Perfil personalizable
- [ ] Historial de compras
- [ ] Mis tickets
- [ ] Eventos favoritos
- [ ] Artistas seguidos
- [ ] Configuración de cuenta

### Semana 14: Sistema de Afiliados
- [ ] Registro como afiliado
- [ ] Código de referido único
- [ ] Panel de afiliado
- [ ] Seguimiento de comisiones
- [ ] Sistema de referidos de usuarios

---

## FASE 3 — V1.0 (Semanas 15-18)

### Semana 15: Programa de Puntos
- [ ] Ganar puntos al comprar
- [ ] Ganar puntos por referidos
- [ ] Ganar puntos por reviews/shares
- [ ] Canjear puntos en compras
- [ ] Historial de puntos
- [ ] Ranking de usuarios

### Semana 16: PWA & Performance
- [ ] Service Worker
- [ ] Offline mode básico
- [ ] Instalación como app
- [ ] Push Notifications
- [ ] Lazy loading imágenes
- [ ] Core Web Vitals 90+

### Semana 17: Multiidioma
- [ ] i18n Angular (ES/EN)
- [ ] Traducciones completas
- [ ] Detección automática de idioma
- [ ] Selector de idioma en UI

### Semana 18: SEO Avanzado
- [ ] SSR (Server Side Rendering)
- [ ] Open Graph / Twitter Cards
- [ ] Schema.org structured data
- [ ] Sitemap dinámico
- [ ] Robots.txt
- [ ] Google Analytics 4 completo

---

## FASE 4 — V2.0 (Futuro)

- [ ] App móvil React Native (iOS + Android)
- [ ] Chat en vivo (Intercom / Crisp)
- [ ] Integración YouTube (videos)
- [ ] Integración Instagram feed
- [ ] IA: Recomendaciones personalizadas
- [ ] IA: Chatbot de soporte
- [ ] Streaming en vivo de eventos
- [ ] NFT tickets (Web3)
- [ ] Marketplace de tickets (reventa)
- [ ] Integración con wearables (pulseras NFC)

---

## Priorización MVP (MoSCoW)

### Must Have (Crítico)
- Auth completa (email + Google)
- Landing page impactante
- Listado y detalle de eventos
- Compra de entradas con pago real
- Ticket digital QR + PDF
- Email de confirmación
- Dashboard admin básico

### Should Have (Importante)
- Blog/noticias
- Perfil de usuario
- Favoritos
- Top 20 artistas con carrusel
- Filtros de eventos avanzados

### Could Have (Deseable)
- Sistema de puntos
- Afiliados
- PWA
- Multiidioma
- Reportes exportables

### Won't Have (Por ahora)
- App móvil nativa
- Chat en vivo
- NFT tickets
- Streaming en vivo
