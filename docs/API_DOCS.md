# FAN TRIBUTE — REST API Documentation

Base URL: `https://api.fantribute.com/v1`

## Autenticación

Todos los endpoints protegidos requieren header:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## AUTH `/auth`

| Method | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registro con email/password | No |
| POST | `/auth/login` | Login con email/password | No |
| POST | `/auth/google` | Login con Google OAuth | No |
| POST | `/auth/refresh` | Renovar access token | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| POST | `/auth/forgot-password` | Enviar reset link | No |
| POST | `/auth/reset-password` | Resetear contraseña | No |
| POST | `/auth/verify-email` | Verificar correo | No |
| POST | `/auth/resend-verification` | Reenviar verificación | Sí |
| POST | `/auth/2fa/enable` | Activar 2FA | Sí |
| POST | `/auth/2fa/verify` | Verificar código 2FA | Sí |
| POST | `/auth/2fa/disable` | Desactivar 2FA | Sí |

---

## USERS `/users`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/users/me` | Perfil del usuario actual | Sí | - |
| PUT | `/users/me` | Actualizar perfil | Sí | - |
| PATCH | `/users/me/avatar` | Cambiar avatar | Sí | - |
| GET | `/users/me/tickets` | Mis entradas | Sí | - |
| GET | `/users/me/orders` | Mis órdenes | Sí | - |
| GET | `/users/me/favorites` | Mis favoritos | Sí | - |
| POST | `/users/me/favorites/:eventId` | Agregar favorito | Sí | - |
| DELETE | `/users/me/favorites/:eventId` | Quitar favorito | Sí | - |
| GET | `/users/me/points` | Mis puntos | Sí | - |
| GET | `/users/me/notifications` | Mis notificaciones | Sí | - |
| PATCH | `/users/me/notifications/:id/read` | Marcar leída | Sí | - |
| GET | `/users` | Listar usuarios | Sí | Admin |
| GET | `/users/:id` | Obtener usuario | Sí | Admin |
| PUT | `/users/:id` | Actualizar usuario | Sí | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Sí | Admin |
| PATCH | `/users/:id/role` | Cambiar rol | Sí | SuperAdmin |
| PATCH | `/users/:id/status` | Cambiar estado | Sí | Admin |

---

## EVENTS `/events`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/events` | Listar eventos (filtros, paginación) | No | - |
| GET | `/events/featured` | Eventos destacados | No | - |
| GET | `/events/upcoming` | Próximos eventos | No | - |
| GET | `/events/:slug` | Detalle de evento | No | - |
| GET | `/events/:id/artists` | Artistas del evento | No | - |
| GET | `/events/:id/tickets` | Tiers de entradas | No | - |
| GET | `/events/:id/stats` | Estadísticas del evento | Sí | Organizer |
| POST | `/events` | Crear evento | Sí | Organizer |
| PUT | `/events/:id` | Actualizar evento | Sí | Organizer |
| DELETE | `/events/:id` | Eliminar evento | Sí | Organizer |
| PATCH | `/events/:id/publish` | Publicar evento | Sí | Organizer |
| POST | `/events/:id/banner` | Subir banner | Sí | Organizer |
| POST | `/events/:id/gallery` | Subir imágenes galería | Sí | Organizer |

### Query params para GET /events:
```
?page=1&limit=12
&search=<texto>
&city=<ciudad>
&country=<CO|US|ES>
&genre=<house|techno|...>
&status=published
&from=2024-01-01
&to=2024-12-31
&minPrice=0
&maxPrice=500000
&sortBy=start_date|price|views_count
&order=ASC|DESC
```

---

## ARTISTS `/artists`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/artists` | Listar artistas | No | - |
| GET | `/artists/top20` | Top 20 EDM | No | - |
| GET | `/artists/featured` | Artistas destacados | No | - |
| GET | `/artists/:slug` | Detalle de artista | No | - |
| GET | `/artists/:id/events` | Eventos del artista | No | - |
| POST | `/artists/:id/follow` | Seguir artista | Sí | - |
| DELETE | `/artists/:id/follow` | Dejar de seguir | Sí | - |
| POST | `/artists` | Crear artista | Sí | Admin |
| PUT | `/artists/:id` | Actualizar artista | Sí | Admin |
| DELETE | `/artists/:id` | Eliminar artista | Sí | Admin |

---

## TICKETS `/tickets`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/tickets/:id` | Detalle de ticket | Sí | Owner/Admin |
| GET | `/tickets/:id/pdf` | Descargar PDF | Sí | Owner |
| GET | `/tickets/:id/qr` | Obtener QR | Sí | Owner |
| POST | `/tickets/:id/transfer` | Transferir ticket | Sí | Owner |
| POST | `/tickets/validate` | Validar QR en entrada | Sí | Organizer |
| GET | `/tickets/validate/history` | Historial de validaciones | Sí | Organizer |

---

## ORDERS `/orders`

| Method | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Crear orden | Sí |
| GET | `/orders/:id` | Detalle de orden | Sí |
| DELETE | `/orders/:id` | Cancelar orden (si pending) | Sí |
| POST | `/orders/apply-coupon` | Aplicar cupón | Sí |

---

## PAYMENTS `/payments`

| Method | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/payments/stripe/intent` | Crear PaymentIntent Stripe | Sí |
| POST | `/payments/mercadopago/preference` | Crear preferencia MP | Sí |
| POST | `/payments/wompi/transaction` | Iniciar transacción Wompi | Sí |
| POST | `/payments/webhook/stripe` | Webhook Stripe | No (sig) |
| POST | `/payments/webhook/mercadopago` | Webhook MercadoPago | No (sig) |
| POST | `/payments/webhook/wompi` | Webhook Wompi | No (sig) |
| GET | `/payments/:id` | Estado del pago | Sí |
| POST | `/payments/:id/refund` | Solicitar reembolso | Sí |

---

## BLOG `/blog`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/blog/posts` | Listar artículos | No | - |
| GET | `/blog/posts/featured` | Artículos destacados | No | - |
| GET | `/blog/posts/:slug` | Detalle de artículo | No | - |
| GET | `/blog/categories` | Listar categorías | No | - |
| GET | `/blog/posts/:id/comments` | Comentarios | No | - |
| POST | `/blog/posts/:id/comments` | Agregar comentario | Sí | - |
| POST | `/blog/posts/:id/like` | Dar like | Sí | - |
| DELETE | `/blog/posts/:id/like` | Quitar like | Sí | - |
| POST | `/blog/posts` | Crear artículo | Sí | Admin |
| PUT | `/blog/posts/:id` | Actualizar artículo | Sí | Admin |
| DELETE | `/blog/posts/:id` | Eliminar artículo | Sí | Admin |
| PATCH | `/blog/posts/:id/publish` | Publicar artículo | Sí | Admin |

---

## ANALYTICS `/analytics` (Admin)

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/analytics/overview` | KPIs generales | Sí | Admin |
| GET | `/analytics/sales` | Ventas por período | Sí | Admin |
| GET | `/analytics/events/:id` | Stats de un evento | Sí | Organizer |
| GET | `/analytics/users` | Métricas de usuarios | Sí | Admin |
| GET | `/analytics/revenue` | Ingresos | Sí | Admin |
| GET | `/analytics/realtime` | Datos en tiempo real (WS) | Sí | Admin |

---

## ADMIN `/admin`

| Method | Endpoint | Descripción | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/admin/dashboard` | Dashboard overview | Sí | Admin |
| GET | `/admin/reports/sales` | Reporte de ventas | Sí | Admin |
| GET | `/admin/reports/users` | Reporte de usuarios | Sí | Admin |
| POST | `/admin/reports/export` | Exportar Excel/PDF | Sí | Admin |
| GET | `/admin/coupons` | Gestión de cupones | Sí | Admin |
| POST | `/admin/coupons` | Crear cupón | Sí | Admin |
| PUT | `/admin/coupons/:id` | Actualizar cupón | Sí | Admin |
| DELETE | `/admin/coupons/:id` | Eliminar cupón | Sí | Admin |
| GET | `/admin/affiliates` | Gestión de afiliados | Sí | Admin |
| PATCH | `/admin/affiliates/:id/payout` | Registrar pago | Sí | Admin |

---

## CONTACT `/contact`

| Method | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Enviar mensaje | No |
| GET | `/contact/messages` | Listar mensajes | Sí (Admin) |
| PATCH | `/contact/messages/:id/read` | Marcar leído | Sí (Admin) |

---

## NEWSLETTER `/newsletter`

| Method | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/newsletter/subscribe` | Suscribirse | No |
| GET | `/newsletter/confirm/:token` | Confirmar suscripción | No |
| DELETE | `/newsletter/unsubscribe/:token` | Desuscribirse | No |

---

## WebSockets (Socket.io)

```
ws://api.fantribute.com

Events emitidos por el servidor:
- 'analytics:realtime'    → { online_users, active_events, sales_today }
- 'event:sold_out'        → { event_id }
- 'ticket:validated'      → { ticket_id, event_id }
- 'payment:confirmed'     → { order_id, user_id }
- 'notification:new'      → { notification }

Events del cliente:
- 'join:event'            → { event_id }  (sala para ver stats en tiempo real)
- 'join:admin'            → {}             (sala dashboard admin)
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request — datos inválidos |
| 401 | Unauthorized — token inválido o expirado |
| 403 | Forbidden — sin permisos |
| 404 | Not Found — recurso no existe |
| 409 | Conflict — datos duplicados |
| 422 | Unprocessable Entity — validación fallida |
| 429 | Too Many Requests — rate limit |
| 500 | Internal Server Error |

Respuesta de error estándar:
```json
{
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Descripción del error",
  "details": ["campo requerido: email"],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```
