import { inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmDialogData, ConfirmDialogDataNotFoundError } from './confirm-dialog';

export function injectConfirmDialogData(): ConfirmDialogData {
  const dialogData = inject(MAT_DIALOG_DATA);
  if (!dialogData) throw new ConfirmDialogDataNotFoundError();
  return dialogData as ConfirmDialogData;
}
