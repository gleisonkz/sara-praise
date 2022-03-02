import { MemberListItemResponse, SongListItemResponse } from '@sp/shared-interfaces';

export interface ScaleListItemResponse {
  scaleID: number;
  title: string;
  notes: string;
  songsQuantity: number;
  date: Date;
  imagesUrl: string[];
}

export interface ScaleDetailResponse {
  scaleID: number;
  title: string;
  date: Date;
  songs: SongListItemResponse[];
  participants: MemberListItemResponse[];
}

export interface ScaleResponse {
  scaleID: number;
  title: string;
  date: Date;
  notes: string;
}

export type ScaleResponseCreate = Pick<ScaleResponse, 'scaleID'>;

export type ScaleRequest = Omit<ScaleResponse, 'scaleID'>;
