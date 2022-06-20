import { IRoleResponse, RoleResponse } from '@sp/shared-interfaces';

import { IsNumber, IsString } from 'class-validator';

export interface ParticipantRequest {
  selected: boolean;
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

export interface ParticipantSelectItemResponse {
  memberID: number;
  participantID: number;
  name: string;
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
  @IsNumber()
  participantID: number;

  @IsString()
  name: string;

  @IsString()
  imageUrl: string;

  roles: ParticipantListItemRole[];
}
