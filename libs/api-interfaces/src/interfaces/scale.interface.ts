import { MemberListItemResponse, ScaleSongResponse } from '@sp/shared-interfaces';

import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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
  notes: string;
  songs: ScaleSongResponse[];
  participants: MemberListItemResponse[];
}

export interface IScaleResponse {
  scaleID: number;
  title: string;
  date: Date;
  notes?: string;
}

export class ScaleResponse implements IScaleResponse {
  @IsNumber()
  scaleID: number;

  @IsString()
  title: string;

  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}

export type ScaleResponseCreate = Pick<IScaleResponse, 'scaleID'>;

export type ScaleRequest = Omit<IScaleResponse, 'scaleID'>;
