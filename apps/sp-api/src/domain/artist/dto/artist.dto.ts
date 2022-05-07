import { ApiProperty } from '@nestjs/swagger';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';

import { IsNumber, IsString } from 'class-validator';

export class ArtistRequestDto implements ArtistRequest {
  @ApiProperty()
  @IsString()
  name: string;
}

export class ArtistResponseDto implements ArtistResponse {
  @ApiProperty()
  @IsNumber()
  artistID: number;

  @ApiProperty()
  @IsString()
  name: string;
}
