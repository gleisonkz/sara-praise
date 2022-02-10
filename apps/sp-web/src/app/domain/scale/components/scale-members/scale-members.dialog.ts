import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';

interface ScaleMembersDialogData {
  scaleId: number;
  members: number[];
}

@Component({
  templateUrl: './scale-members.dialog.html',
  styleUrls: ['./scale-members.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleMembersDialog {
  constructor(
    public readonly ministryService: MinistryService,
    @Inject(MAT_DIALOG_DATA) private data: ScaleMembersDialogData
  ) {}
}
