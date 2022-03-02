import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
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
    roles: FormArray<{
      roleID: FormControl<number | null>;
      isChecked: FormControl<boolean | null>;
    }>;
    // permissions: FormGroup<{
    //   permissionID: FormControl<number | null>;
    //   selected: FormControl<boolean | null>;
    // }>;
  }>;

  ngOnInit(): void {
    console.log('dialogData', this.dialogData);

    this.ministryService
      .getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID)
      .subscribe((roles: any[]) => {
        this.createForm(roles);
      });
  }

  createForm(roles: any[]) {
    this.memberForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      // roles: new FormGroup({
      //   roleID: new FormControl(null, Validators.required),
      //   selected: new FormControl(null, [Validators.required]),
      // }),
      roles: new FormArray(
        roles.map((role: any) => {
          const group = new FormGroup({
            roleID: new FormControl(role.roleID, Validators.required),
            isChecked: new FormControl(role.isChecked, [Validators.required]),
          });

          return group;
        })
      ),
      // permissions: new FormGroup({
      //   permissionID: new FormControl(null, Validators.required),
      //   selected: new FormControl(null, [Validators.required]),
      // }),
    });
  }

  submitForm() {
    if (this.memberForm.invalid) return;

    return this.memberForm.value;
  }
}
