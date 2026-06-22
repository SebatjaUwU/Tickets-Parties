import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  ngOnInit(): void {
    // Restore session if token exists and is valid
    if (this.tokenService.isAccessTokenValid()) {
      this.authService.loadCurrentUser().subscribe({
        error: () => this.tokenService.clearTokens(),
      });
    }
  }
}
