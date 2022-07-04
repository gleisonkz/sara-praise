import { inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum eDialogMode {
  CREATE,
  EDIT,
}

export interface MinisterKeyDialogData {
  ministryID: number;
  memberID?: number;
  songID?: number;
  mode?: eDialogMode;
}

interface MinisterKeyOutputDialogData {
  ministryID: number;
  memberID?: number;
  songID?: number;
  mode: eDialogMode;
}

export class MinisterKeyDialogDataNotFoundError extends Error {
  constructor() {
    super('MINISTER_KEY_DIALOG_DATA was not injected.');
  }
}

export function injectMinisterKeyDialogData(): MinisterKeyOutputDialogData {
  const dialogData = inject<MinisterKeyDialogData>(MAT_DIALOG_DATA);

  if (!dialogData) throw new MinisterKeyDialogDataNotFoundError();

  const output: MinisterKeyOutputDialogData = {
    ...dialogData,
    mode: dialogData.mode || eDialogMode.CREATE,
  };

  return output;
}
