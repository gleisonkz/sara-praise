import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SongListItemResponse } from '@sp/shared-interfaces';

import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { MinistryService } from 'apps/sp-web/src/app/shared/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsPage implements OnInit {
  songListItems$: Observable<SongListItemResponse[]>;

  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.songListItems$ = this.ministryService.getSongListItems(+ministryID);
  }
}
