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

import { IRoleResponse } from '@sp/shared-interfaces';

import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
    MemberApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/member.api.service';
import { MemberStore } from 'apps/sp-web/src/app/shared/stores/member/member.store';
import { MinistryApiService } from '../../core/services/ministry.api.service';

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
    private dialogData: {
      ministryID: number;
      memberID?: number;
    }
  ) {}

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
    isChecked: FormControl<boolean>;
  }>;

  ngOnInit(): void {
    this.ministryService
      .getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID)
      .subscribe((roles: IRoleResponse[]) => {
        this.createForm(roles);
        this.changeDetectorRef.detectChanges();

        const memberRolesFormArray = this.memberForm.controls.roles;

        this.ministryRolesFormArray.valueChanges.subscribe((roles) => {
          memberRolesFormArray.clear();

          roles
            .filter((role) => role.isChecked)
            .forEach((role) => {
              const control = new FormControl(role.roleID);
              memberRolesFormArray.push(control);
            });
        });
      });
  }

  createForm(roles: any[]) {
    this.memberForm = new FormGroup({
      name: new FormControl('Gleison', Validators.required),
      email: new FormControl('gleison@teste.com', Validators.required),
      password: new FormControl('123456', Validators.required),
      imageUrl: new FormControl('https://randomuser.me/api/portraits/men/59.jpg', Validators.required),
      // roles: new FormGroup({
      //   roleID: new FormControl(null, Validators.required),
      //   selected: new FormControl(null, [Validators.required]),
      // }),
      roles: new FormArray([]),
    });

    this.ministryRolesFormArray = new FormArray(
      roles.map((role: any) => {
        const group = new FormGroup({
          name: new FormControl({
            disabled: true,
            value: role.name,
          }),
          roleID: new FormControl(role.roleID, Validators.required),
          isChecked: new FormControl(role.isChecked, [Validators.required]),
        });

        return group;
      })
    );

    // permissions: new FormGroup({
    //   permissionID: new FormControl(null, Validators.required),
    //   selected: new FormControl(null, [Validators.required]),
    // }),
  }

  submitForm() {
    if (this.memberForm.invalid) return;

    const member = this.memberForm.value;
    this.memberStore.create(this.dialogData.ministryID, member).subscribe(() => this.dialogRef.close());
  }
}
