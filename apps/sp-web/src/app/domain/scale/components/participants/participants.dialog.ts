/* eslint-disable @ngneat/reactive-forms/no-angular-forms-imports */
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MemberListItemResponse, Role } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import {
    MinistryService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.service';
import { map, Observable } from 'rxjs';

interface ParticipantsDialogData {
  scaleId: number;
  ministryID: number;
}

@Component({
  templateUrl: './participants.dialog.html',
  styleUrls: ['./participants.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsDialog implements OnInit {
  members$: Observable<any[]>;

  members: {
    item: MemberListItemResponse;
    form: FormGroup;
    selected: FormControl<boolean>;
    roles: {
      form: FormGroup;
      item: Role;
    }[];
  }[];

  // getParticipantFormGroupByMemberID(memberID: number): any {
  //   return this.participantsFormArray.controls.find(
  //     (participantFormGroup: any) => participantFormGroup.get('memberID').value === memberID
  //   ) as FormGroup;
  // }

  // getRolesFormArray(participantsIndex: number): any {
  //   return this.participantsFormArray.at(participantsIndex).get('roles') as any;
  // }

  constructor(
    public readonly ministryService: MinistryService,

    @Inject(MAT_DIALOG_DATA) private data: ParticipantsDialogData
  ) {}

  ngOnInit(): void {
    this.ministryService
      .getMemberListItems(this.data.ministryID)
      .pipe(
        map((members: MemberListItemResponse[]) => {
          const membersGroup = members.map((member: MemberListItemResponse) => {
            const group = new FormGroup({
              ministryID: new FormControl(this.data.ministryID),
              scaleID: new FormControl(this.data.scaleId),
              participantID: new FormControl(member.participantID),
              memberID: new FormControl(member.memberID),
            });

            const roles = member.roles.map((role) => {
              const form = new FormGroup({
                roleID: new FormControl(role.roleID),
                selected: new FormControl(null, [Validators.required]),
              });

              const tuple = {
                form,
                item: role,
              };

              return tuple;
            });

            const selectedControl = new FormControl(false);

            return { item: member, form: group, selected: selectedControl, roles };
          });

          return membersGroup;
        })
      )
      .subscribe((members: any[]) => (this.members = members));
  }

  // toggleChanged(
  //   { checked: isChecked }: MatSlideToggleChange,
  //   member: MemberListItemResponse,
  //   participantIndex: number
  // ) {
  //   if (!isChecked) return this.participantsFormArray.removeAt(participantIndex);

  //   const group = new FormGroup({
  //     ministryID: new FormControl(this.data.ministryID),
  //     scaleID: new FormControl(this.data.scaleId),
  //     participantID: new FormControl(null),
  //     memberID: new FormControl(member.memberID),
  //     roles: new FormGroup({}),
  //   });

  //   const rolesGroup = group.get('roles') as FormGroup;

  //   member.roles.forEach((role) => {
  //     rolesGroup.addControl(role.roleID.toString(), new FormControl(null, [Validators.required]));
  //   });

  //   rolesGroup.valueChanges.subscribe((roles) => {
  //     const entries = Object.entries(rolesGroup.controls);
  //     entries.forEach(([, roleControl]) => roleControl.enable({ emitEvent: false }));

  //     const checkedRolesQuantity = entries.filter(([, roleControl]) => roleControl.value).length;

  //     const hasMinisterRoleChecked = !!rolesGroup.get(eMinistryRole.MINISTER.toString())?.value;
  //     const hasBackVocalRoleChecked = !!rolesGroup.get(eMinistryRole.BACK_VOCAL.toString())?.value;
  //     const hasOtherRoleDifferentThanMinisterAndBackVocalChecked =
  //       checkedRolesQuantity === 1 && !hasMinisterRoleChecked && !hasBackVocalRoleChecked;

  //     if (hasMinisterRoleChecked) this.disableRoleControlsByRoleID([eMinistryRole.BACK_VOCAL], participantIndex);
  //     if (hasBackVocalRoleChecked) this.disableRoleControlsByRoleID([eMinistryRole.MINISTER], participantIndex);
  //     if (hasOtherRoleDifferentThanMinisterAndBackVocalChecked)
  //       this.disabledRoleControlsByRoleIDExcept([eMinistryRole.MINISTER, eMinistryRole.BACK_VOCAL], participantIndex);

  //     const hasTwoRolesChecked = checkedRolesQuantity === 2;

  //     if (!hasTwoRolesChecked) return;
  //     const checkedRolesIDs = Object.entries(roles)
  //       .filter(([, isChecked]) => isChecked)
  //       .map(([roleID]) => +roleID);

  //     const rolesControlToDisable = entries
  //       .filter(([roleID]) => !checkedRolesIDs.includes(+roleID))
  //       .map(([, control]) => control);

  //     rolesControlToDisable.forEach((control) => control.disable({ emitEvent: false }));
  //     return;

  //     entries.forEach(([roleID, control]) => {
  //       // console.log('roleID1', roleID1, 'roleID2', roleID2, 'roleID', +roleID);
  //       // if (+roleID === roleID1 || +roleID === roleID2) return;
  //       console.log('roleID', +roleID);
  //       // control.disable({ emitEvent: false });
  //     });

  //     Object.entries(roles).forEach(([roleID, isChecked]) => {
  //       const isMinisterRoleLike = +roleID === eMinistryRole.MINISTER || +roleID === eMinistryRole.BACK_VOCAL;
  //       // if (isMinisterRoleLike && !isChecked) return;

  //       // const controls = rolesGroup.controls;
  //       // Object.entries(controls).forEach(([controlKey, control]) => {
  //       //   const isMinisterControlLike =
  //       //     +controlKey === eMinistryRole.MINISTER || +controlKey === eMinistryRole.BACK_VOCAL;
  //       //   if (isMinisterControlLike) return;

  //       //   control.disable({
  //       //     emitEvent: false,
  //       //   });
  //       // });
  //     });
  //   });

  //   this.participantsFormArray.push(group);
  // }

  // toggleRoleControl(roleID: number, participantIndex: number) {
  //   const rolesFormArray = this.getRolesFormArray(participantIndex);
  //   const roleControl = rolesFormArray.get(roleID.toString());
  //   roleControl.setValue(!roleControl.value);
  // }

  // getRoleControlByRoleID(roleID: number, participantIndex: number) {
  //   const rolesFormArray = this.getRolesFormArray(participantIndex);
  //   return rolesFormArray.get(roleID.toString());
  // }

  // disableRoleControlsByRoleID(roleID: eMinistryRole[], participantIndex: number) {
  //   const rolesFormArray = this.getRolesFormArray(participantIndex);
  //   roleID.forEach((role) => {
  //     const roleControl = rolesFormArray.get(role.toString());
  //     roleControl.disable({ emitEvent: false });
  //   });
  // }

  // disabledRoleControlsByRoleIDExcept(roleID: eMinistryRole[], participantIndex: number) {
  //   const rolesFormArray = this.getRolesFormArray(participantIndex);
  //   rolesFormArray.controls.forEach((roleControl: AbstractControl) => {
  //     if (roleID.includes(+roleControl.value)) return;
  //     roleControl.disable({ emitEvent: false });
  //   });
  // }

  // isRoleDisabled(roleID: number, participantIndex: number): boolean {
  //   const rolesFormArray = this.getRolesFormArray(participantIndex);
  //   const roleControl = rolesFormArray.get(roleID.toString());
  //   return roleControl.disabled;
  // }

  submitForm() {
    const participants = this.members
      .filter((member) => member.selected.value)
      .map((member) => {
        const roles = member.roles.filter((role) => role.form.value.selected).map((role) => role.item.roleID);

        const participant = {
          ...member.form.value,
          roles,
        };

        return participant;
      });

    console.log('participants', participants);
  }
}
