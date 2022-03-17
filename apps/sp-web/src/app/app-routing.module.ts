import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'apps/sp-web/src/app/domain/auth/guards/auth.guard';
import { IsLoggedInGuard } from 'apps/sp-web/src/app/domain/auth/guards/logged-in.guard';

const ROUTES: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  {
    path: 'ministerios',
    canLoad: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: async () => (await import('./domain/ministry/ministry.domain.module')).MinistryDomainModule,
  },
  {
    path: 'auth',
    loadChildren: async () => (await import('./domain/auth/auth.domain.module')).AuthDomainModule,
    canActivate: [IsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
