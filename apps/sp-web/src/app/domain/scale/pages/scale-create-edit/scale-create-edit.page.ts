import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import {
    IScaleResponse, ParticipantListItem, ParticipantRequest, ScaleRequest, ScaleSongRequest,
    ScaleSongResponse
} from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
    ScaleApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/scale.api.service';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import {
    ParticipantsDialog
} from 'apps/sp-web/src/app/domain/scale/components/participants/participants.dialog';
import {
    ScaleSongsDialog
} from 'apps/sp-web/src/app/domain/scale/components/scale-songs/scale-songs.dialog';
import { injectOptionalRouteParam } from 'apps/sp-web/src/app/shared/functions';
import { EMPTY, filter, Observable, skip, switchMap, tap } from 'rxjs';

@Component({
  templateUrl: './scale-create-edit.page.html',
  styleUrls: ['./scale-create-edit.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleCreateEditPage implements OnInit {
  scaleID = injectOptionalRouteParam('scaleID');
  ministryID = injectMinistryID();

  dateGroup = new FormGroup({
    date: new FormControl<Date>(),
    time: new FormControl<Date>(),
  });

  participantListItems$: Observable<ParticipantListItem[]>;
  scaleSongs$: Observable<ScaleSongResponse[]>;

  scaleFormGroup: FormGroup<{
    scaleID?: FormControl<number>;
    date: FormControl<Date>;
    title: FormControl<string>;
    notes: FormControl<string>;
  }>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastService: HotToastService,
    private readonly router: Router,
    private readonly scaleApiService: ScaleApiService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.scaleFormGroup.controls.date.valueChanges
      .pipe(
        filter((date) => !!date),
        tap((date) => {
          this.dateGroup.controls.date.setValue(date, { emitEvent: false });
          this.dateGroup.controls.time.setValue(date, { emitEvent: false });
        }),
        skip(1)
      )
      .subscribe(() => this.scaleFormGroup.controls.date.markAsDirty());

    this.dateGroup.valueChanges.pipe(filter(({ date, time }) => !!date && !!time)).subscribe(({ date, time }) => {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const hour = time.getHours();
      const minute = time.getMinutes();
      const second = time.getSeconds();

      const fullDate = new Date(year, month, day, hour, minute, second);
      this.scaleFormGroup.controls.date.setValue(fullDate);
    });

    if (!this.scaleID) return;

    this.participantListItems$ = this.scaleApiService.findAllParticipantListItems(this.ministryID, this.scaleID);
    this.scaleSongs$ = this.scaleApiService.findAllSongs(this.ministryID, this.scaleID);

    this.scaleApiService.findByID(this.ministryID, this.scaleID).subscribe((scale: IScaleResponse) => {
      this.scaleFormGroup.patchValue(scale);
    });
  }

  addMember() {
    const dialogRef = this.matDialog.open(ParticipantsDialog, {
      data: {
        scaleID: this.scaleID,
        ministryID: this.ministryID,
      },

      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((participantRequest: ParticipantRequest) => !!participantRequest),
        switchMap((participantRequest: ParticipantRequest) =>
          this.scaleID
            ? this.scaleApiService.createParticipant(this.ministryID, this.scaleID, participantRequest)
            : EMPTY
        )
      )
      .subscribe(() => {
        this.toastService.success('Participante adicionado com sucesso');
      });
  }

  addSong() {
    const dialogRef = this.matDialog.open(ScaleSongsDialog, {
      data: {
        scaleID: this.scaleID,
        ministryID: this.ministryID,
      },

      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((songsRequest: ScaleSongRequest[]) => !!songsRequest?.length),
        switchMap((songsRequest) =>
          this.scaleID ? this.scaleApiService.createSong(this.ministryID, this.scaleID, songsRequest) : EMPTY
        )
      )
      .subscribe(() => {
        this.toastService.success('Música adicionada com sucesso');
      });
  }

  onSubmitScale() {
    const isScaleFormValid = this.scaleFormGroup.valid;
    if (!isScaleFormValid) return;

    const { title, notes, date } = this.scaleFormGroup.value;

    const scaleRequest: ScaleRequest = {
      title,
      date,
      notes,
    };

    if (this.scaleID)
      return this.scaleApiService.update(this.ministryID, scaleRequest, this.scaleID).subscribe(() => {
        this.toastService.success('Escala atualizada com sucesso!');
        this.router.navigate([this.scaleID, 'view'], {
          relativeTo: this.activatedRoute.parent,
        });
      });

    return this.scaleApiService.create(this.ministryID, scaleRequest).subscribe(({ scaleID }) => {
      this.toastService.success(`Escala criada com sucesso!`);
      this.scaleFormGroup.reset();
      this.router.navigate([scaleID, 'edit'], {
        relativeTo: this.activatedRoute.parent,
      });
    });
  }

  private createForm() {
    const date = new Date();

    const scaleForm = new FormGroup({
      date: new FormControl(date, [Validators.required]),
      title: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
    });

    this.scaleFormGroup = scaleForm;
  }
}
