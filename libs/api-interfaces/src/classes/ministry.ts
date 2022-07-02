import { IsNumber, IsString } from 'class-validator';

export class MinistryListItemResponse {
  @IsNumber()
  ministryID: number;

  @IsString()
  name: string;

  @IsNumber()
  songsQuantity: number;

  @IsNumber()
  membersQuantity: number;

  @IsNumber()
  scalesQuantity: number;

  @IsNumber()
  songKeysQuantity: number;

  @IsNumber()
  artistQuantity: number;
}
