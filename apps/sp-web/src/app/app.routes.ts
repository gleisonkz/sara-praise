import { Routes } from '@angular/router';

import { AuthGuard } from 'apps/sp-web/src/app/shared/guards/auth/auth.guard';
import { IsLoggedInGuard } from 'apps/sp-web/src/app/shared/guards/logged-in/logged-in.guard';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  {
    path: 'ministerios',
    canLoad: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: async () => (await import('./domain/ministry/ministry.routes')).MINISTRY_ROUTES,
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./domain/auth/auth.routes')).AUTH_ROUTES,
    canActivate: [IsLoggedInGuard],
  },
];
