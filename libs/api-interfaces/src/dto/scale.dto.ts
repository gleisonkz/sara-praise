import { MemberListItemResponse, SongListItemResponse } from '@sp/shared-interfaces';

export interface ScaleListItemResponse {
  scaleID: number;
  title: string;
  notes: string;
  songsQuantity: number;
  date: string;
  imagesUrl: string[];
}

export interface ScaleDetailResponse {
  scaleID: number;
  title: string;
  date: string;
  songs: SongListItemResponse[];
  participants: MemberListItemResponse[];
}

export interface ScaleResponse {
  scaleID: number;
  title: string;
  date: string;
  time: string;
  notes: string;
}

export type ScaleResponseCreate = Pick<ScaleResponse, 'scaleID'>;

export type ScaleRequest = Omit<ScaleResponse, 'scaleID'>;
