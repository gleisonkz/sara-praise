import {
    animate, animateChild, query, stagger, style, transition, trigger
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SongListItemResponse } from '@sp/shared-interfaces';

import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { LIST_ANIMATION } from 'apps/sp-web/src/app/shared/animations/list.animation';
import { Observable } from 'rxjs';
import { MinistryService } from '../../../services/ministry.service';

@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    LIST_ANIMATION,
    trigger('fade', [transition(':enter', [style({ opacity: 0 }), animate('.6s ease')])]),
    trigger('list', [transition('* => *', [query(':enter', stagger(250, animateChild()))])]),
  ],
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
