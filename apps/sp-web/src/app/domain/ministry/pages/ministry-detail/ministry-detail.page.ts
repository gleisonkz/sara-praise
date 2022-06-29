import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MinistryListItemResponse } from '@sp/shared-interfaces';
import { MediaIfDirective } from '@sp/web/widget/directives';

import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    ArtistDialog
} from 'apps/sp-web/src/app/domain/ministry/components/artist-dialog/artist-dialog.component';
import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { filter, Observable } from 'rxjs';
import {
    MinistryKeyDialogComponent
} from '../../components/ministry-key-dialog/ministry-key-dialog.component';
import { SongDialog } from '../../components/song-dialog/song.dialog';

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
  ],
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number = injectMinistryID();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly toastService: HotToastService,
    private readonly ministryStore: MinistryStore
  ) {}

  ngOnInit(): void {
    this.ministryListItem$ = this.ministryStore.findByID(this.ministryID);
  }

  deleteMinistry(ministryID: number) {
    this.ministryStore.remove(ministryID);
    this.router.navigate(['/ministerios']);
  }

  goToCreateScale() {
    this.router.navigate(['escalas', 'create'], { relativeTo: this.activatedRoute });
  }

  goToCreateMusic() {
    this.dialog
      .open(SongDialog, {
        data: {
          ministryID: this.ministryID,
        },
        width: '100%',
        maxWidth: '600px',
        panelClass: 'member-dialog',
      })
      .afterClosed()
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((result: unknown) => {
        console.log(result);
      });
  }

  goToCreateArtist() {
    this.dialog.open(ArtistDialog, {
      data: {
        ministryID: this.ministryID,
      },
      width: '100%',
      maxWidth: '600px',
      panelClass: 'member-dialog',
    });
    // .afterClosed()
    // .pipe(filter(Boolean))
    // .subscribe({
    //   next: () => {
    //     this.toastService.success('Cadastrado com sucesso');
    //   },
    //   error: (err) => {
    //     this.toastService.error(err);
    //   },
    // });
  }

  goToCreateMinistryMember() {
    this.dialog
      .open(MemberDialog, {
        data: {
          ministryID: this.ministryID,
        },
        width: '100%',
        maxWidth: '600px',
        panelClass: 'member-dialog',
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.toastService.success('Cadastrado com sucesso');
      });
  }

  goToCreateMinistryKey() {
    this.dialog
      .open(MinistryKeyDialogComponent, {
        data: {
          ministryID: this.ministryID,
        },
        width: '100%',
        maxWidth: '600px',
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.toastService.success('Cadastrado com sucesso');
      });
  }
}
