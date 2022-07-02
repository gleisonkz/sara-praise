import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';
import { MinisterSongKeyStore } from '@sp/web/shared/stores';
import { SpForDirective } from '@sp/web/widget/directives';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
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
  ],
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<IMinisterSongKeyListItemResponse[]> = of([]);
  ministryID = injectMinistryID();
  constructor(private readonly ministerSongKeyStore: MinisterSongKeyStore) {}

  ngOnInit(): void {
    this.keysListItems$ = this.ministerSongKeyStore.findAll(this.ministryID);
  }

  remove({ songID, memberID }: IMinisterSongKeyListItemResponse): void {
    this.ministerSongKeyStore.remove(this.ministryID, songID, memberID).subscribe();
  }
}
