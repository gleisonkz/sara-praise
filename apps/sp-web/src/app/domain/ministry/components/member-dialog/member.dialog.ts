import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit
} from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MinistryService } from '../../core/services/ministry.service';

@Component({
  templateUrl: './member.dialog.html',
  styleUrls: ['./member.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDialog implements OnInit {
  constructor(
    public readonly ministryService: MinistryService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: {
      ministryID: number;
      memberID?: number;
    }
  ) {}

  memberForm: FormGroup<{
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    roles: FormArray<number>;
    // permissions: FormGroup<{
    //   permissionID: FormControl<number | null>;
    //   selected: FormControl<boolean | null>;
    // }>;
  }>;

  ministryRolesFormArray: FormArray<{
    name: FormControl<string | null>;
    roleID: FormControl<number | null>;
    isChecked: FormControl<boolean | null>;
  }>;

  ngOnInit(): void {
    console.log('dialogData', this.dialogData);

    this.ministryService
      .getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID)
      .subscribe((roles: any[]) => {
        this.createForm(roles);
        this.changeDetectorRef.detectChanges();

        const memberRolesFormArray = this.memberForm.controls.roles;

        this.ministryRolesFormArray.valueChanges.subscribe((roles: any[]) => {
          memberRolesFormArray.clear();

          roles
            .filter((role: any) => role.isChecked)
            .forEach((role: any) => {
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

    console.log('member', this.memberForm.value);
  }
}
