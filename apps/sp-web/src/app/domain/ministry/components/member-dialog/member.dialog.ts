/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    MemberApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/member.api.service';
import { MemberStore } from 'apps/sp-web/src/app/shared/stores/member/member.store';
import { combineLatest, of } from 'rxjs';
import { MinistryApiService } from '../../core/services/ministry.api.service';

@UntilDestroy()
@Component({
  templateUrl: './member.dialog.html',
  styleUrls: ['./member.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
  ],
})
export class MemberDialog implements OnInit {
  constructor(
    public readonly ministryService: MinistryApiService,
    public readonly memberService: MemberApiService,
    public readonly memberStore: MemberStore,
    private readonly dialogRef: MatDialogRef<MemberDialog>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      ministryID: number;
      memberID?: number;
    }
  ) {}

  hasChange = false;

  memberForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    imageUrl: FormControl<string>;
    roles: FormArray<number>;
    // permissions: FormGroup<{
    //   permissionID: FormControl<number | null>;
    //   selected: FormControl<boolean | null>;
    // }>;
  }>;

  ministryRolesFormArray: FormArray<{
    name: FormControl<string | null>;
    roleID: FormControl<number>;
    iconUrl: FormControl<string>;
    isChecked: FormControl<boolean>;
  }>;

  ngOnInit(): void {
    const roles$ = this.ministryService.getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID);
    const member$ = this.dialogData?.memberID
      ? this.memberService.findByID(this.dialogData.ministryID, this.dialogData.memberID)
      : of(null);

    combineLatest([roles$, member$]).subscribe(([roles, member]) => {
      this.createForm(roles, member);
      this.changeDetectorRef.detectChanges();

      const memberRolesFormArray = this.memberForm.controls.roles;

      this.ministryRolesFormArray.valueChanges.pipe(untilDestroyed(this)).subscribe((roles) => {
        memberRolesFormArray.clear();

        roles
          .filter((role) => role.isChecked)
          .forEach((role) => {
            const control = new FormControl(role.roleID);
            memberRolesFormArray.push(control);
          });
      });
    });

    // this.ministryService
    //   .getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID)
    //   .subscribe((roles: IRoleResponse[]) => {
    //     this.createForm(roles);
    //     this.changeDetectorRef.detectChanges();

    //     const memberRolesFormArray = this.memberForm.controls.roles;

    //     this.ministryRolesFormArray.valueChanges.subscribe((roles) => {
    //       memberRolesFormArray.clear();

    //       roles
    //         .filter((role) => role.isChecked)
    //         .forEach((role) => {
    //           const control = new FormControl(role.roleID);
    //           memberRolesFormArray.push(control);
    //         });
    //     });
    //   });
  }

  createForm(roles: any[], member?: any) {
    this.memberForm = new FormGroup({
      name: new FormControl(member?.name, [Validators.required]),
      email: new FormControl('', ...(member ? [] : [Validators.required])),
      password: new FormControl('', ...(member ? [] : [Validators.required])),
      imageUrl: new FormControl(member?.imageUrl, Validators.required),
      roles: new FormArray([]),
    });

    this.ministryRolesFormArray = new FormArray(
      roles.map((role) => {
        const group = new FormGroup({
          name: new FormControl({
            disabled: true,
            value: role.name,
          }),
          roleID: new FormControl(role.roleID, Validators.required),
          iconUrl: new FormControl(
            {
              disabled: true,
              value: role.iconUrl,
            },
            Validators.required
          ),
          isChecked: new FormControl(role.isChecked, [Validators.required]),
        });

        return group;
      })
    );

    // permissions: new FormGroup({
    //   permissionID: new FormControl(null, Validators.required),
    //   selected: new FormControl(null, [Validators.required]),
    // }),

    this.onCreateGroupFormValueChange();
  }

  onCreateGroupFormValueChange() {
    const initialValue = this.memberForm.value;
    const keys = Object.keys(initialValue) as (keyof typeof initialValue)[];

    this.memberForm.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.hasChange = keys.some((key) => {
        const hasChanged = JSON.stringify(value[key]) !== JSON.stringify(initialValue[key]);
        return hasChanged;
      });
    });
  }

  submitForm() {
    if (this.memberForm.invalid) return;

    const member = this.memberForm.value;
    const actionFn = this.dialogData.memberID
      ? () => this.memberStore.update(this.dialogData.ministryID, this.dialogData.memberID!, member)
      : () => this.memberStore.create(this.dialogData.ministryID, member);

    actionFn()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.dialogRef.close());
  }
}
