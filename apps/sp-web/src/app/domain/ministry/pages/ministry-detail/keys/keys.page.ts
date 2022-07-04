import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';
import { MinisterKeyDialogComponent } from '@sp/web/domain/ministry/components';
import { eDialogMode, injectMinistryID, MinisterKeyDialogData } from '@sp/web/shared/functions';
import { MinisterSongKeyStore } from '@sp/web/shared/stores';
import { SpForDirective } from '@sp/web/widget/directives';

import { DEFAULT_MAT_DIALOG_CONFIG } from 'apps/sp-web/src/app/shared/constants/dialog-config';
import { Observable, of } from 'rxjs';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    SpForDirective,
    MatFormFieldModule,
    CommonModule,
    MatDialogModule,
  ],
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<IMinisterSongKeyListItemResponse[]> = of([]);
  ministryID = injectMinistryID();
  constructor(private readonly ministerSongKeyStore: MinisterSongKeyStore, private readonly matDialog: MatDialog) {}

  ngOnInit(): void {
    this.keysListItems$ = this.ministerSongKeyStore.findAll(this.ministryID);
  }

  remove({ songID, memberID }: IMinisterSongKeyListItemResponse): void {
    this.ministerSongKeyStore.remove(this.ministryID, songID, memberID).subscribe();
  }

  edit(key: IMinisterSongKeyListItemResponse): void {
    const data: MinisterKeyDialogData = {
      ministryID: this.ministryID,
      memberID: key.memberID,
      songID: key.songID,
      mode: eDialogMode.EDIT,
    };

    this.matDialog.open(MinisterKeyDialogComponent, {
      data,
      ...DEFAULT_MAT_DIALOG_CONFIG,
    });
  }
}
