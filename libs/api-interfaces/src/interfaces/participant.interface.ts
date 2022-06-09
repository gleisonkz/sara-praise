import { IRoleResponse, RoleResponse } from '@sp/shared-interfaces';

import { IsString } from 'class-validator';

export interface ParticipantRequest {
  ministryID: number;
  scaleID: number;
  memberID: number;
  participantID: number;
  roles: number[];
}

export interface ParticipantResponse {
  memberID: number;
  name: string;
  imageUrl: string;
  roles: IRoleResponse[];
  participant: ParticipantItem;
}

interface ParticipantItem {
  participantID?: number;
  roles: ParticipantRole[];
}

export interface ParticipantRole {
  roleID: number;
}

export type ParticipantListItemRole = Omit<RoleResponse, 'isChecked'>;

export class ParticipantListItem {
  @IsString()
  name: string;
  @IsString()
  imageUrl: string;
  roles: ParticipantListItemRole[];
}
