import { inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface BaseScaleDialogData {
  scaleID: number;
  ministryID: number;
}

export class MatDialogDataNotFoundError extends Error {
  constructor() {
    super('MAT_DIALOG_DATA was not injected.');
  }
}

export function injectBaseDialogData(): BaseScaleDialogData {
  const dialogData = inject(MAT_DIALOG_DATA);
  if (!dialogData) throw new MatDialogDataNotFoundError();
  return dialogData;
}
