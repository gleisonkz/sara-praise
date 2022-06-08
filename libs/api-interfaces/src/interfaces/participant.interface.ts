import { RoleResponse } from '@sp/shared-interfaces';

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
  roles: RoleResponse[];
  participant: ParticipantItem;
}

interface ParticipantItem {
  participantID?: number;
  roles: ParticipantRole[];
}

export interface ParticipantRole {
  roleID: number;
}
