import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { IRoleResponse, MemberListItemResponse } from '@sp/shared-interfaces';
import { injectMinistryID } from '@sp/web/shared/functions';

import { FormControl } from '@ngneat/reactive-forms';
import {
    MinistryApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.api.service';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface ParticipantsDialogData {
  scaleID: number;
  ministryID: number;
}

@Component({
  templateUrl: './participants.dialog.html',
  styleUrls: ['./participants.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatListModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
  ],
})
export class ParticipantsDialog implements OnInit {
  members$: Observable<
    {
      item: MemberListItemResponse;
      form: UntypedFormGroup;
      checkedRoles$: BehaviorSubject<number>;
      roles: {
        form: UntypedFormGroup;
        item: IRoleResponse;
      }[];
    }[]
  >;

  ministryID = injectMinistryID();

  members: {
    item: MemberListItemResponse;
    form: UntypedFormGroup;

    roles: {
      form: UntypedFormGroup;
      item: IRoleResponse;
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
    public readonly ministryService: MinistryApiService,
    private readonly scaleApiService: ScaleApiService,
    private readonly dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private data: ParticipantsDialogData
  ) {}

  ngOnInit(): void {
    this.members$ = this.scaleApiService.findAllParticipants(this.data.ministryID, this.data.scaleID).pipe(
      map((members: MemberListItemResponse[]) => {
        const membersGroup = members.map((member: MemberListItemResponse) => {
          const group = new UntypedFormGroup({
            selected: new FormControl(!!member.participantID),
            ministryID: new FormControl(this.data.ministryID),
            scaleID: new FormControl(this.data.scaleID),
            participantID: new FormControl(member.participantID),
            memberID: new FormControl(member.memberID),
          });

          const checkedRoles$ = new BehaviorSubject<number>(0);

          const roles = member.roles.map((role) => {
            const rolesForm = new UntypedFormGroup({
              roleID: new FormControl(role.roleID),
              selected: new FormControl(role.isChecked, [Validators.required]),
            });

            const selectedRoleControl = rolesForm.get('selected') as FormControl<boolean>;
            const initialValue = selectedRoleControl.value ? 1 : 0;
            checkedRoles$.next(initialValue + checkedRoles$.value);

            selectedRoleControl.valueChanges.pipe(map((selected) => (selected ? 1 : -1))).subscribe((value) => {
              const currentValue = checkedRoles$.value + value;
              const nextValue = currentValue > 0 ? currentValue : 0;
              checkedRoles$.next(nextValue);
            });

            const obj = {
              form: rolesForm,
              item: { ...role, iconUrl: role.iconUrl.split('/').pop()?.split('.')[0] },
            } as any;

            return obj;
          });

          return {
            checkedRoles$,
            item: member,
            form: group,
            roles,
          };
        });

        this.members = membersGroup;
        return membersGroup;
      })
    );
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

  async submitForm() {
    const participants = this.members
      .filter((member) => member.form.value.selected || member.form.value.participantID)
      .map((member) => {
        const roles = member.roles.filter((role) => role.form.value.selected).map((role) => role.item.roleID);

        const participant = {
          ...member.form.value,
          roles,
        };

        return participant;
      });

    this.dialogRef.close(participants);
  }
}
