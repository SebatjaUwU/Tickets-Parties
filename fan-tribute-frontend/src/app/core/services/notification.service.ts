import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, duration = 4000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['snack-success'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  error(message: string, duration = 5000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['snack-error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  info(message: string, duration = 3000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['snack-info'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  warning(message: string, duration = 4000): void {
    this.snackBar.open(message, '✕', {
      duration,
      panelClass: ['snack-warning'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
