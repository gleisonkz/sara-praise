import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'sp-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  hello$ = this.http.get('/api/ministry');
  constructor(private http: HttpClient) {}
}
