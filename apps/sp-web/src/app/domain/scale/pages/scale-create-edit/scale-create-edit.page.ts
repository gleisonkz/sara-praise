import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { ScaleRequest, ScaleResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry-detail-route.service';
import {
    MinistryApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.api.service';
import {
    ParticipantsDialog
} from 'apps/sp-web/src/app/domain/scale/components/participants/participants.dialog';
import { filter, map, skip, switchMap, tap } from 'rxjs';

@Component({
  templateUrl: './scale-create-edit.page.html',
  styleUrls: ['./scale-create-edit.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleCreateEditPage implements OnInit {
  scaleID: number;
  ministryID: number;

  dateGroup = new FormGroup({
    date: new FormControl<Date>(),
    time: new FormControl<Date>(),
  });

  scaleFormGroup: FormGroup<{
    scaleID?: FormControl<number>;
    date: FormControl<Date>;
    title: FormControl<string>;
    notes: FormControl<string>;
  }>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly ministryService: MinistryApiService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastService: HotToastService,
    private readonly router: Router,
    private readonly ministryDetailRouteService: MinistryDetailRouteService
  ) {}

  ngOnInit(): void {
    this.ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);

    const parentRoute = this.activatedRoute;
    if (!parentRoute) throw new Error('parentRoute is undefined');

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

    parentRoute.params
      .pipe(
        map(({ scaleID }) => +scaleID),
        filter((scaleID) => !!scaleID),
        tap((id) => (this.scaleID = id)),
        switchMap((scaleID) => this.ministryService.getScaleByID(this.ministryID, scaleID))
      )
      .subscribe((scale: ScaleResponse) => {
        this.scaleFormGroup.patchValue(scale);
      });
  }

  addMember() {
    this.matDialog.open(ParticipantsDialog, {
      data: {
        scaleId: this.scaleID,
        ministryID: this.ministryID,
      },

      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
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
      return this.ministryService.updateScale(this.ministryID, scaleRequest, this.scaleID).subscribe(() => {
        this.toastService.success('Escala atualizada com sucesso!');
        this.router.navigate([this.scaleID, 'view'], {
          relativeTo: this.activatedRoute.parent,
        });
      });

    return this.ministryService.createScale(this.ministryID, scaleRequest).subscribe(({ scaleID }) => {
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
