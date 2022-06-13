import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePT from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { JwtModule } from '@auth0/angular-jwt';
import { HotToastModule } from '@ngneat/hot-toast';
import { tokenGetter } from 'apps/sp-web/src/app/domain/auth/auth.service';
import {
    HttpErrorInterceptor
} from 'apps/sp-web/src/app/shared/interceptors/http-error.interceptor';
import { LogInterceptor } from 'apps/sp-web/src/app/shared/interceptors/log.interceptor';
import { MinistryStore } from 'apps/sp-web/src/app/shared/state/ministry.store';
import { environment } from 'apps/sp-web/src/environments/environment.prod';
import { NgSimpleStateModule } from 'ng-simple-state';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(localePT);

@NgModule({
  declarations: [AppComponent],
  imports: [
    HotToastModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    NgSimpleStateModule.forRoot({
      enableDevTool: !environment.production,
      enableLocalStorage: false,
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: { tokenGetter },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    MinistryStore,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
