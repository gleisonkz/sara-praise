import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { ArtistResponse } from '@sp/shared-interfaces';
import { ArtistApiService } from '@sp/web/domain/ministry/services';
import { SpForDirective } from '@sp/web/widget/directives';

import {
    ArtistListItemComponent
} from 'apps/sp-web/src/app/domain/ministry/components/artist-list-item/artist-list-item.component';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './artists.page.html',
  styleUrls: ['./artists.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogModule, MatMenuModule, MatListModule, CommonModule, ArtistListItemComponent, SpForDirective],
})
export class ArtistsPage implements OnInit {
  artistListItems$: Observable<ArtistResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly artistApiService: ArtistApiService) {}

  ngOnInit(): void {
    this.artistListItems$ = this.artistApiService.getArtists(this.ministryID);
  }
}
