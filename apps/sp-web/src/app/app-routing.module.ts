import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './domain/auth/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  {
    path: 'ministerios',
    canLoad: [AuthGuard],
    loadChildren: async () => (await import('./domain/ministry/ministry.domain.module')).MinistryDomainModule,
  },
  { path: 'auth', loadChildren: async () => (await import('./domain/auth/auth.domain.module')).AuthDomainModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
