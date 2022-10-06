import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Pagination, SongListItemResponse } from '@sp/shared-interfaces';
import { MinistryApiService } from '@sp/web/domain/ministry/services';
import { injectMinistryID } from '@sp/web/shared/functions';
import { SongStore } from '@sp/web/shared/stores';
import { SongListItemComponent } from '@sp/web/widget/components';
import { SpForDirective } from '@sp/web/widget/directives';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SongDialog } from 'apps/sp-web/src/app/domain/ministry/components/song-dialog/song.dialog';
import { LIST_STAGGER } from 'apps/sp-web/src/app/shared/animations/list-stagger.animation';
import {
    AddButtonComponent
} from 'apps/sp-web/src/app/widget/components/add-button/add-button.component';
import { filter, Observable } from 'rxjs';

export interface SongDialogData {
  ministryID: number;
  songID: number | undefined;
}

@UntilDestroy()
@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    SongListItemComponent,
    SpForDirective,
    MatListModule,
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AddButtonComponent,
  ],
  animations: [LIST_STAGGER],
})
export class SongsPage implements OnInit {
  songListItems$: Observable<Pagination<SongListItemResponse>>;
  readonly ministryID = injectMinistryID();
  keys$ = this.ministryApiService.getKeys(this.ministryID);

  length = 100;
  pageSize = 25;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    public readonly ministryApiService: MinistryApiService,
    private readonly dialog: MatDialog,
    private readonly songStore: SongStore,
    private readonly observer: BreakpointObserver
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit');

    this.observer.observe('(max-width: 600px)').subscribe(({ matches: isMobile }) => {
      this.pageSize = isMobile ? 5 : 25;
    });

    this.songListItems$ = this.songStore.findAll(this.ministryID, this.pageSize, 1);
  }

  changePage(event: PageEvent) {
    console.log(event);
    this.songListItems$ = this.songStore.findAll(this.ministryID, event.pageSize, event.pageIndex + 1);
  }

  deleteSong(songID: number) {
    this.songStore.delete(this.ministryID, songID).subscribe();
  }

  showDialog(songID?: number): void {
    this.dialog
      .open<SongDialog, SongDialogData>(SongDialog, {
        data: {
          ministryID: this.ministryID,
          songID,
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
}
