import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ArtistResponse } from '@sp/shared-interfaces';
import { ArtistApiService, MinistryDetailRouteService } from '@sp/web/domain/ministry/services';

import { Observable } from 'rxjs';

@Component({
  templateUrl: './artists.page.html',
  styleUrls: ['./artists.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsPage implements OnInit {
  artistListItems$: Observable<ArtistResponse[]>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly artistApiService: ArtistApiService
  ) {}

  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.artistListItems$ = this.artistApiService.getArtists(ministryID);
  }
}
