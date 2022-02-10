import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
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
  scaleId: number;
  scaleFormGroup: any;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const parentRoute = this.activatedRoute;
    if (!parentRoute) throw new Error('parentRoute is undefined');

    this.createForm();

    parentRoute.params
      .pipe(
        map(({ scaleID }) => +scaleID),
        tap((id) => (this.scaleId = id))
        // switchMap((scaleID) => this.ministryService.getScaleListItemDetails(scaleID))
      )
      .subscribe();
  }

  createForm() {
    const date = new Date();
    date.setHours(7);

    const scaleForm = new FormGroup({
      scaleID: new FormControl(null),
      title: new FormControl(''),
      date: new FormControl(date),
      time: new FormControl(date),
      notes: new FormControl(''),
      participants: new FormArray([
        new FormGroup({
          participantID: new FormControl(null),
          memberID: new FormControl(null),
          roleID: new FormControl(null),
        }),
        new FormGroup({
          participantID: new FormControl(null),
          memberID: new FormControl(null),
          roleID: new FormControl(null),
        }),
      ]),
      songs: new FormControl(),
    });

    this.scaleFormGroup = scaleForm;
  }

  addMember() {
    this.matDialog.open(ScaleMembersDialog, {
      data: {
        scaleId: this.scaleId,
        members: [],
      },
      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
    });
  }
}
