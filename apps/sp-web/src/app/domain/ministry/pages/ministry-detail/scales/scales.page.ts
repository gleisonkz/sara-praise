/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ScaleListItemResponse } from '@sp/shared-interfaces';
import { injectMinistryID } from '@sp/web/shared/functions';
import { RemoveDotsPipe } from '@sp/web/widget/pipes';

import { UntilDestroy } from '@ngneat/until-destroy';
import { FADE_ANIMATION } from 'apps/sp-web/src/app/shared/animations/fade.animation';
import { ScaleStore } from 'apps/sp-web/src/app/shared/stores/scale/scale.store';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_ANIMATION],
  standalone: true,
  imports: [CommonModule, RemoveDotsPipe, RouterModule, MatIconModule, MatDialogModule, MatCardModule, MatButtonModule],
})
export class ScalesPage implements OnInit {
  scaleListItems$: Observable<ScaleListItemResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly scaleStore: ScaleStore
  ) {}
  ngOnInit(): void {
    this.scaleListItems$ = this.scaleStore.findAll(this.ministryID);
  }

  goToCreateScale() {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }
}
