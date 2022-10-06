import { ApiProperty } from '@nestjs/swagger';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';

import { IsNumber, IsString } from 'class-validator';

export class MinisterSongKeyListItemResponse implements IMinisterSongKeyListItemResponse {
  @ApiProperty()
  @IsString()
  memberImageUrl: string;

  @ApiProperty()
  @IsString()
  memberName: string;

  @ApiProperty()
  @IsNumber()
  memberID: number;

  @ApiProperty()
  @IsNumber()
  songID: number;

  @ApiProperty()
  @IsString()
  artistName: string;

  @ApiProperty()
  @IsString()
  songTitle: string;

  @ApiProperty()
  @IsString()
  songKey: string;

  @ApiProperty()
  @IsNumber()
  songKeyID: number;
}
