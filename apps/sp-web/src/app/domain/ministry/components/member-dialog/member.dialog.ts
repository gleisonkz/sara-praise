import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit
} from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MemberRequest, RoleResponse } from '@sp/shared-interfaces';

import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { MemberFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/member.facade';
import {
    MemberApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/member.api.service';
import { MinistryApiService } from '../../core/services/ministry.api.service';

@Component({
  templateUrl: './member.dialog.html',
  styleUrls: ['./member.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDialog implements OnInit {
  constructor(
    public readonly ministryService: MinistryApiService,
    public readonly memberService: MemberApiService,
    public readonly memberFacade: MemberFacade,

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
    imageUrl: FormControl<string | null>;
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
    console.log('dialogData', this.dialogData);

    this.ministryService
      .getRolesByMemberID(this.dialogData.ministryID, this.dialogData?.memberID)
      .subscribe((roles: RoleResponse[]) => {
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

    const member = this.memberForm.value as MemberRequest;
    this.memberFacade.addMember(this.dialogData.ministryID, member);
  }
}
