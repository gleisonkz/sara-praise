import { enableProdMode } from '@angular/core';

import { AppComponent } from 'apps/sp-web/src/app/app.component';
import { ENVIRONMENT } from './environments/environment';

if (ENVIRONMENT.production) {
  enableProdMode();
}

AppComponent.bootstrap();
