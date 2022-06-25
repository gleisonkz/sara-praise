import {
    animate, animateChild, query, stagger, style, transition, trigger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SongListItemResponse } from '@sp/shared-interfaces';
import { SongStore } from '@sp/web/shared/stores';
import { SongListItemComponent } from '@sp/web/widget/components';
import { SpForDirective } from '@sp/web/widget/directives';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { LIST_ANIMATION } from 'apps/sp-web/src/app/shared/animations/list.animation';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    LIST_ANIMATION,
    trigger('fade', [transition(':enter', [style({ opacity: 0 }), animate('.6s ease')])]),
    trigger('list', [transition('* => *', [query(':enter', stagger(250, animateChild()))])]),
  ],
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
