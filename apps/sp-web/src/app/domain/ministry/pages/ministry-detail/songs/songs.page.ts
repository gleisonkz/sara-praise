import {
    animate, animateChild, query, stagger, style, transition, trigger
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { SongListItemResponse } from '@sp/shared-interfaces';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { LIST_ANIMATION } from 'apps/sp-web/src/app/shared/animations/list.animation';
import { Observable } from 'rxjs';
import { MinistryApiService } from '../../../core/services/ministry.api.service';

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
  readonly MINISTRY_ID = injectMinistryID();

  constructor(private readonly ministryService: MinistryApiService) {}

  ngOnInit(): void {
    this.songListItems$ = this.ministryService.getSongListItems(+this.MINISTRY_ID);
  }
}
