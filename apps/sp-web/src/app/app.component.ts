import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'sp-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  public constructor(domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIcon('bass', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/roles/bass.svg'));
  }
  ngOnInit(): void {
    const docWidth = document.documentElement.offsetWidth;
    [].forEach.call(document.querySelectorAll('*'), function (el: any) {
      if (el.offsetWidth > docWidth) {
        console.log(el);
      }
    });
  }
}
