import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { AUTH_INTERCEPTOR_PROVIDERS } from './auth.interceptor';
import { SignInPage } from './pages/sign-in/sign-in.page';
import { SignUpPage } from './pages/sign-up/sign-up.page';

@NgModule({
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [SignInPage, SignUpPage, AuthComponent],
  providers: [AUTH_INTERCEPTOR_PROVIDERS],
})
export class AuthDomainModule {}
