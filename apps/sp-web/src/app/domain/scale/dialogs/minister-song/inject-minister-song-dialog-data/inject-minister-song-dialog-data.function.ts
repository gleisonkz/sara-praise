import { inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { eMinistryRole, ScaleSongResponse } from '@sp/shared-interfaces';

export interface MinisterSongDialogData {
  scaleID: number;
  ministryID: number;
  song: ScaleSongResponse;
  role: eMinistryRole;
}

export class MatDialogDataNotFoundError extends Error {
  constructor() {
    super('MAT_DIALOG_DATA was not injected.');
  }
}

export function injectMinisterSongDialogData(): MinisterSongDialogData {
  const dialogData = inject(MAT_DIALOG_DATA);
  if (!dialogData) throw new MatDialogDataNotFoundError();
  return dialogData;
}
