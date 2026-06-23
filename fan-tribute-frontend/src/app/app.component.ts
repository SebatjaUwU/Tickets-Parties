import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Session restoration is handled entirely by APP_INITIALIZER in app.config.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
