import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { MinisterSongKeyListItemResponse } from '@sp/shared-interfaces';

import {
    MINISTRY_ID, MINISTRY_ID_PROVIDER
} from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.provider';
import { Observable, of } from 'rxjs';
import { MinistryApiService } from '../../../core/services/ministry.api.service';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MINISTRY_ID_PROVIDER],
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<MinisterSongKeyListItemResponse[]> = of([]);
  constructor(
    private readonly ministryService: MinistryApiService,
    @Inject(MINISTRY_ID) private readonly ministryID: number
  ) {}

  ngOnInit(): void {
    this.keysListItems$ = this.ministryService.getMinisterSongKeys(this.ministryID);
  }
}
