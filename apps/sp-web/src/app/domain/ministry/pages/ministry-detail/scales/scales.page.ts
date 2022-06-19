/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ScaleListItemResponse } from '@sp/shared-interfaces';
import { RemoveDotsPipe } from '@sp/web/widget/pipes';

import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { FADE_ANIMATION } from 'apps/sp-web/src/app/shared/animations/fade.animation';
import { ScaleStore } from 'apps/sp-web/src/app/shared/stores/scale/scale.store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_ANIMATION],
  standalone: true,
  imports: [CommonModule, RemoveDotsPipe, RouterModule, MatIconModule, MatDialogModule, MatCardModule],
})
export class ScalesPage implements OnInit {
  scaleListItems$: Observable<ScaleListItemResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly scaleStore: ScaleStore) {}
  ngOnInit(): void {
    this.scaleListItems$ = this.scaleStore.findAll(this.ministryID);
  }
}
