import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';
import { SpForDirective } from '@sp/web/widget/directives';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { Observable, of } from 'rxjs';
import { MinistryApiService } from '../../../core/services/ministry.api.service';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatListModule, SpForDirective, MatFormFieldModule],
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<IMinisterSongKeyListItemResponse[]> = of([]);
  ministryID = injectMinistryID();
  constructor(private readonly ministryService: MinistryApiService) {}

  ngOnInit(): void {
    this.keysListItems$ = this.ministryService.getMinisterSongKeys(this.ministryID);
  }
}
