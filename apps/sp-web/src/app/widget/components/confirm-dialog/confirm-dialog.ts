import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { injectConfirmDialogData } from './inject-confirm-dialog-data.function';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export class ConfirmDialogDataNotFoundError extends Error {
  constructor() {
    super('MAT_DIALOG_DATA was not provided to the ConfirmDialogComponent.');
  }
}

@Component({
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>

    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>

    <div class="actions" mat-dialog-actions>
      <button [mat-dialog-close]="false" mat-button>{{ data.cancelButtonText ?? 'Não' }}</button>
      <button [mat-dialog-close]="true" mat-raised-button color="primary">{{ data.confirmButtonText ?? 'Sim' }}</button>
    </div>
  `,
  styles: [
    `
      h1 {
        font-size: 1.5rem;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmDialogComponent {
  data = injectConfirmDialogData();
}
