import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { ArtistResponse } from '@sp/shared-interfaces';
import { SpForDirective } from '@sp/web/widget/directives';

import {
    ArtistDialog
} from 'apps/sp-web/src/app/domain/ministry/components/artist-dialog/artist-dialog.component';
import {
    ArtistListItemComponent
} from 'apps/sp-web/src/app/domain/ministry/components/artist-list-item/artist-list-item.component';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { ArtistStore } from 'apps/sp-web/src/app/shared/stores/artist/artist.store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './artists.page.html',
  styleUrls: ['./artists.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    CommonModule,
    ArtistListItemComponent,
    SpForDirective,
    MatDialogModule,
  ],
})
export class ArtistsPage implements OnInit {
  artistListItems$: Observable<ArtistResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly matDialog: MatDialog, private readonly artistStore: ArtistStore) {}

  ngOnInit(): void {
    this.artistListItems$ = this.artistStore.findAll(this.ministryID);
  }

  remove(artistID: number) {
    this.artistStore.remove(this.ministryID, artistID).subscribe();
  }

  edit(artist: ArtistResponse) {
    this.matDialog.open(ArtistDialog, {
      data: {
        ministryID: this.ministryID,
        artist,
      },
    });
  }
}
