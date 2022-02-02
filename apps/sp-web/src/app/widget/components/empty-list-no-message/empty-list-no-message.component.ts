import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sp-list-no-message',
  template: ` <p>{{ message }}</p> `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyListNoMessageComponent {
  @Input() message: string;
}
