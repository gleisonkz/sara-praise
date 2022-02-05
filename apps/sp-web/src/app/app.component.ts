import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'sp-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  public constructor(domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIcon('bass', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/bass.svg'));
  }
}
