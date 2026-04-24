import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppFooter } from './core/layout/app-footer/app-footer';
import { AppHeader } from './core/layout/app-header/app-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, AppFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
