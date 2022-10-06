import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sp-add-button',
  template: `
    <button class="desktop" (click)="clickEvent.emit()" mat-button><mat-icon>add</mat-icon> {{ buttonText }}</button>

    <button class="mobile" (click)="clickEvent.emit()" mat-mini-fab color="primary">
      <mat-icon>add</mat-icon>
    </button>
  `,
  styleUrls: ['./add-button.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class AddButtonComponent {
  @Input() buttonText: string;
  @Output() clickEvent = new EventEmitter();
}
