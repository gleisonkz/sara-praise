import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'apps/sp-web/src/app/domain/auth/guards/logged-in.guard';
import { AuthComponent } from './auth.component';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        canActivate: [LoggedInGuard],
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        canActivate: [LoggedInGuard],
        path: 'sign-in',
        component: SignInPage,
      },
      { path: 'sign-up', component: SignUpPage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
