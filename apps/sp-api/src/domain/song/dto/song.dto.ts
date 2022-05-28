import { ApiProperty } from '@nestjs/swagger';

import { SongRequest, SongResponse } from '@sp/shared-interfaces';

import { IsNumber, IsString } from 'class-validator';

export class SongRequestDto implements SongRequest {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  artistID: number;

  @ApiProperty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsNumber()
  keyID: number;

  @ApiProperty({ required: false })
  @IsString()
  audioUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  youtubeUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  lyricUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  chordsUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  observations: string;
}

export class SongResponseDto implements SongResponse {
  @ApiProperty()
  @IsNumber()
  songID: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  artistID: number;

  @ApiProperty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsNumber()
  keyID: number;

  @ApiProperty()
  @IsString()
  audioUrl: string;

  @ApiProperty()
  @IsString()
  youtubeUrl: string;

  @ApiProperty()
  @IsString()
  lyricUrl: string;

  @ApiProperty()
  @IsString()
  chordsUrl: string;

  @ApiProperty()
  @IsString()
  observations: string;
}
