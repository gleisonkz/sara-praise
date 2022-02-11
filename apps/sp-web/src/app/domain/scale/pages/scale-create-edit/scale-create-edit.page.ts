import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { ScaleRequest, ScaleResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import {
    ScaleMembersDialog
} from 'apps/sp-web/src/app/domain/scale/components/scale-members/scale-members.dialog';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  templateUrl: './scale-create-edit.page.html',
  styleUrls: ['./scale-create-edit.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleCreateEditPage implements OnInit {
  scaleID: number;
  ministryID: number;
  scaleFormGroup: FormGroup<{
    scaleID?: FormControl<number>;
    date: FormControl<Date>;
    title: FormControl<string>;
    time: FormControl<Date>;
    notes: FormControl<string>;
  }>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly ministryService: MinistryService,
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

    parentRoute.params
      .pipe(
        map(({ scaleID }) => +scaleID),
        filter((scaleID) => !!scaleID),
        tap((id) => (this.scaleID = id)),
        switchMap((scaleID) => this.ministryService.getScaleByID(scaleID))
      )
      .subscribe((scale: ScaleResponse) => {
        this.scaleFormGroup.patchValue(scale);
      });
  }

  addMember() {
    this.matDialog.open(ScaleMembersDialog, {
      data: {
        scaleId: this.scaleID,
      },

      maxWidth: '800px',
      width: '100%',
      panelClass: 'sp-scale-modal',
    });
  }

  onSubmitScale() {
    const isScaleFormValid = this.scaleFormGroup.valid;
    if (!isScaleFormValid) return;

    const { title, time, notes, date } = this.scaleFormGroup.value;

    const scaleRequest: ScaleRequest = {
      title,
      date: date.toISOString(),
      notes,
      time: time.toISOString(),
    };

    if (this.scaleID)
      return this.ministryService.updateScale(scaleRequest, this.scaleID).subscribe(() => {
        this.toastService.success('Escala atualizada com sucesso!');
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
    date.setHours(7);

    const scaleForm = new FormGroup({
      date: new FormControl(date, [Validators.required]),
      title: new FormControl('', [Validators.required]),
      time: new FormControl(date, [Validators.required]),
      notes: new FormControl(''),
    });

    this.scaleFormGroup = scaleForm;
  }
}
