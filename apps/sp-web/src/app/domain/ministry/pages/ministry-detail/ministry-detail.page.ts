import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { IMinisterSongKeyRequest, MinistryListItemResponse } from '@sp/shared-interfaces';
import { MinistryApiService } from '@sp/web/domain/ministry/services';
import { MediaIfDirective } from '@sp/web/widget/directives';

import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    ArtistDialog
} from 'apps/sp-web/src/app/domain/ministry/components/artist-dialog/artist-dialog.component';
import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import {
    MusicDialogComponent
} from 'apps/sp-web/src/app/domain/ministry/components/music-dialog/music-dialog.component';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { MinistryStore } from 'apps/sp-web/src/app/shared/state/ministry.store';
import { filter, Observable, switchMap } from 'rxjs';
import {
    MinistryKeyDialogComponent
} from '../../components/ministry-key-dialog/ministry-key-dialog.component';

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
    private readonly ministryApiService: MinistryApiService,
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
    const dialogRef = this.dialog.open(MusicDialogComponent, {
      data: {
        ministryID: this.ministryID,
      },
      width: '100%',
      maxWidth: '600px',
      panelClass: 'member-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((result: unknown) => {
        console.log(result);
      });
  }
  goToCreateArtist() {
    const dialogRef = this.dialog.open(ArtistDialog, {
      data: {
        ministryID: this.ministryID,
      },
      width: '100%',
      maxWidth: '600px',
      panelClass: 'member-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((result: unknown) => {
        console.log(result);
      });
  }

  goToCreateMinistryMember() {
    const dialogRef = this.dialog.open(MemberDialog, {
      data: {
        ministryID: this.ministryID,
      },
      width: '100%',
      maxWidth: '600px',
      panelClass: 'member-dialog',
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.toastService.success('Cadastrado com sucesso');
      });
  }

  goToCreateMinistryKey() {
    const dialogRef = this.dialog.open(MinistryKeyDialogComponent, {
      data: this.ministryID,
      width: '100%',
      maxWidth: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        switchMap((ministerSongKeyRequest: IMinisterSongKeyRequest) =>
          this.ministryApiService.createMinisterSongKey(this.ministryID, ministerSongKeyRequest)
        )
      )
      .subscribe(() => {
        this.toastService.success('Cadastrado com sucesso');
      });
  }
}
