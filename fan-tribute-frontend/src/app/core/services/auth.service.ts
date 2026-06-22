import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { User, AuthTokens, LoginDto, RegisterDto } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => ['admin', 'super_admin'].includes(this._currentUser()?.role ?? ''));
  readonly isOrganizer = computed(() => ['organizer', 'admin', 'super_admin'].includes(this._currentUser()?.role ?? ''));
  readonly loading = this._loading.asReadonly();

  private readonly API = `${environment.apiUrl}/auth`;

  register(dto: RegisterDto): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API}/register`, dto).pipe(
      tap(tokens => this.handleAuthSuccess(tokens))
    );
  }

  login(dto: LoginDto): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API}/login`, dto).pipe(
      tap(tokens => this.handleAuthSuccess(tokens))
    );
  }

  googleLogin(idToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API}/google`, { idToken }).pipe(
      tap(tokens => this.handleAuthSuccess(tokens))
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthTokens>(`${this.API}/refresh`, { refreshToken });
  }

  logout(): void {
    this.http.post(`${this.API}/logout`, {}).subscribe();
    this.tokenService.clearTokens();
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.API}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.API}/reset-password`, { token, password });
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.API}/verify-email`, { token });
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  private handleAuthSuccess(tokens: AuthTokens): void {
    this.tokenService.setTokens(tokens);
    this.loadCurrentUser().subscribe();
  }
}
