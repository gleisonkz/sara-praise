import { ApiProperty } from '@nestjs/swagger';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';

import { IsString } from 'class-validator';

export class MinisterSongKeyListItemResponse implements IMinisterSongKeyListItemResponse {
  @ApiProperty()
  @IsString()
  memberImageUrl: string;

  @ApiProperty()
  @IsString()
  memberName: string;

  @ApiProperty()
  @IsString()
  artistName: string;

  @ApiProperty()
  @IsString()
  songTitle: string;

  @ApiProperty()
  @IsString()
  songKey: string;
}
