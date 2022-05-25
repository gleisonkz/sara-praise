import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ArtistResponse, KeyResponse } from '@sp/shared-interfaces';
import { ArtistApiService, MinistryApiService } from '@sp/web/domain/ministry/services';

import { Observable } from 'rxjs';

@Component({
  templateUrl: './music-dialog.component.html',
  styleUrls: ['./music-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicDialogComponent implements OnInit {
  songKeys$: Observable<KeyResponse[]>;
  artists$: Observable<ArtistResponse[]>;

  classifications = [
    { name: 'Júbilo', value: 1 },
    { name: 'Adoração', value: 2 },
  ];

  constructor(
    public readonly ministryService: MinistryApiService,
    private readonly artistApiService: ArtistApiService,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number }
  ) {}

  ngOnInit() {
    this.songKeys$ = this.ministryService.getKeys();
    this.artists$ = this.artistApiService.getArtists(this.data.ministryID);
  }

  submitForm() {
    console.log('submitForm');
  }
}
