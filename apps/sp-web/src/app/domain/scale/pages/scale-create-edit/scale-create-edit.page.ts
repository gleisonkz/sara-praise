import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import {
    ScaleMembersDialog
} from 'apps/sp-web/src/app/domain/scale/components/scale-members/scale-members.dialog';
import { map, tap } from 'rxjs';

interface ScaleMemberRequest {
  memberID: number;
  roleID: number;
}

interface ScaleSongRequest {
  songID: number;
}

interface ScaleRequest {
  title: string;
  date: Date;
  notes: string;
  members: ScaleMemberRequest[];
  songs: ScaleSongRequest[];
}

@Component({
  templateUrl: './scale-create-edit.page.html',
  styleUrls: ['./scale-create-edit.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleCreateEditPage implements OnInit {
  scale$: any;
  scaleId: number;

  scaleFormGroup: FormGroup<ScaleRequest>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const parentRoute = this.activatedRoute.parent;
    if (!parentRoute) throw new Error('parentRoute is undefined');

    this.scale$ = parentRoute.params.pipe(
      map(({ scaleID }) => +scaleID),
      tap((id) => (this.scaleId = id))
      // switchMap((scaleID) => this.ministryService.getScaleListItemDetails(scaleID))
    );
  }

  createForm() {
    const scaleForm = new FormGroup({
      title: new FormControl(''),
      date: new FormControl(''),
      notes: new FormControl(''),
      members: new FormControl([]),
      songs: new FormControl([]),
    });
  }

  addMember() {
    this.matDialog.open(ScaleMembersDialog, {
      data: this.scaleId,
      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
    });
  }
}
