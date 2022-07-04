import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePT from '@angular/common/locales/pt';
import { Component, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';

import { JwtModule } from '@auth0/angular-jwt';
import { HotToastModule } from '@ngneat/hot-toast';
import { APP_ROUTES } from 'apps/sp-web/src/app/app.routes';
import { tokenGetter } from 'apps/sp-web/src/app/domain/auth/auth.service';
import {
    HttpErrorInterceptor
} from 'apps/sp-web/src/app/shared/interceptors/http-error.interceptor';
import { LogInterceptor } from 'apps/sp-web/src/app/shared/interceptors/log.interceptor';
import { STORES } from 'apps/sp-web/src/app/shared/stores/stores.provider';
import { environment } from 'apps/sp-web/src/environments/environment.prod';
import { NgSimpleStateModule } from 'ng-simple-state';

registerLocaleData(localePT);

@Component({
  selector: 'sp-root',
  template: ` <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  public constructor(domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIcon('bass', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/bass.svg'));
    matIconRegistry.addSvgIcon('keys', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/keys.svg'));
    matIconRegistry.addSvgIcon(
      'voice-recorder-mic',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/voice-recorder-mic.svg')
    );
    matIconRegistry.addSvgIcon(
      'acoustic-guitar',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/acoustic-guitar.svg')
    );
    matIconRegistry.addSvgIcon(
      'electric-guitar',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/electric-guitar.svg')
    );
    matIconRegistry.addSvgIcon('drums', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/drums.svg'));
  }

  public static bootstrap() {
    bootstrapApplication(this, {
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        ...STORES,
        importProvidersFrom(
          RouterModule.forRoot(APP_ROUTES),
          HotToastModule.forRoot(),
          BrowserAnimationsModule,
          HttpClientModule,
          ReactiveFormsModule,
          JwtModule.forRoot({
            config: { tokenGetter },
          }),
          NgSimpleStateModule.forRoot({
            enableDevTool: !environment.production,
            enableLocalStorage: false,
          })
        ),
      ],
    }).catch((err) => console.error(err));
  }
}
