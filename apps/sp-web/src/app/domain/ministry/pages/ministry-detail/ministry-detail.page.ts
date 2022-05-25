import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MinistryFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/ministry.facade';
import {
    ArtistDialog
} from 'apps/sp-web/src/app/domain/ministry/components/artist-dialog/artist-dialog.component';
import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import {
    MusicDialogComponent
} from 'apps/sp-web/src/app/domain/ministry/components/music-dialog/music-dialog.component';
import { filter, Observable, tap } from 'rxjs';
import {
    MinistryKeyDialogComponent
} from '../../components/ministry-key-dialog/ministry-key-dialog.component';

@UntilDestroy()
@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number;

  constructor(
    private readonly ministryFacade: MinistryFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ministryListItem$ = this.ministryFacade.ministry$.pipe(
      tap((ministry: MinistryListItemResponse) => {
        this.ministryID = ministry.ministryID;
      })
    );
  }

  deleteMinistry(ministryID: number) {
    this.ministryFacade.removeMinistry(ministryID);
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
      .subscribe((result: any) => {
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
      .subscribe((result: any) => {
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
      .subscribe((result: any) => {
        console.log(result);
      });
  }

  goToCreateMinistryKey() {
    const dialogRef = this.dialog.open(MinistryKeyDialogComponent, {
      data: this.ministryID,
      width: '100%',
      maxWidth: '600px',
    });

    // dialogRef
    //   .afterClosed()
    //   .pipe(untilDestroyed(this), filter(Boolean))
    //   .subscribe((result: MinistryKeyRequest) => {
    //     this.ministryService.createMinistryKey(this.ministryID, result).subscribe((ministryKey) => {
    //       console.log(ministryKey);
    //     });
    //   });
  }
}
