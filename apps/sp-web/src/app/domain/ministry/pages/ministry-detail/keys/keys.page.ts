import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { Observable, of } from 'rxjs';
import { MinistryApiService } from '../../../core/services/ministry.api.service';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<IMinisterSongKeyListItemResponse[]> = of([]);
  ministryID = injectMinistryID();
  constructor(private readonly ministryService: MinistryApiService) {}

  ngOnInit(): void {
    this.keysListItems$ = this.ministryService.getMinisterSongKeys(this.ministryID);
  }
}
