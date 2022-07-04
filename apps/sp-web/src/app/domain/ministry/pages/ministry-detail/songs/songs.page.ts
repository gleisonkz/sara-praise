import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SongListItemResponse } from '@sp/shared-interfaces';
import { injectMinistryID } from '@sp/web/shared/functions';
import { SongStore } from '@sp/web/shared/stores';
import { SongListItemComponent } from '@sp/web/widget/components';
import { SpForDirective } from '@sp/web/widget/directives';

import { Observable } from 'rxjs';

@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, SongListItemComponent, SpForDirective, MatListModule, CommonModule],
})
export class SongsPage implements OnInit {
  songListItems$: Observable<SongListItemResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly songStore: SongStore) {}

  ngOnInit(): void {
    this.songListItems$ = this.songStore.findAll(this.ministryID);
  }
}
