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
  date: Date;
  songs: SongListItemResponse[];
  participants: MemberListItemResponse[];
}
