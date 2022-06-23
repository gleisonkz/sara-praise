import { Routes } from '@angular/router';

import { IsLoggedInGuard } from 'apps/sp-web/src/app/shared/guards/logged-in/logged-in.guard';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    canActivate: [IsLoggedInGuard],
    path: 'sign-in',
    component: SignInPage,
  },
  { path: 'sign-up', component: SignUpPage },
];
