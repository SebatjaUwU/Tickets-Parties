import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocurrió un error inesperado';

      if (error.status === 0) {
        message = 'Sin conexión al servidor. Verifica tu internet.';
      } else if (error.status === 403) {
        message = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        message = 'El recurso solicitado no fue encontrado.';
      } else if (error.status === 422) {
        const details = error.error?.details;
        message = details?.join(', ') ?? error.error?.message ?? message;
      } else if (error.status === 429) {
        message = 'Demasiadas solicitudes. Intenta de nuevo en un momento.';
      } else if (error.status >= 500) {
        message = 'Error del servidor. Por favor intenta más tarde.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      if (error.status !== 401) {
        notificationService.error(message);
      }

      return throwError(() => error);
    })
  );
};
