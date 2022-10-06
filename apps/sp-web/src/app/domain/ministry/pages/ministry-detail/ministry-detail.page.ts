import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MinistryListItemResponse } from '@sp/shared-interfaces';
import { injectMinistryID } from '@sp/web/shared/functions';
import { MediaIfDirective } from '@sp/web/widget/directives';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { delay, Observable } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    CommonModule,
    MediaIfDirective,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatBadgeModule,
  ],
})
export class MinistryDetailPage implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number = injectMinistryID();

  constructor(
    private readonly router: Router,
    private readonly ministryStore: MinistryStore,
    private readonly observer: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.ministryListItem$ = this.ministryStore.findByID(this.ministryID);
  }

  ngAfterViewInit(): void {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1000), untilDestroyed(this))
      .subscribe(({ matches: isMobile }) => {
        if (!this.sidenav) return;
        this.sidenav.mode = isMobile ? 'over' : 'side';
        this.sidenav.opened = !isMobile;
      });
  }

  deleteMinistry(ministryID: number) {
    this.ministryStore.remove(ministryID);
    this.router.navigate(['/ministerios']);
  }
}
