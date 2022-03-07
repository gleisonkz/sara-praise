import { ApiProperty } from '@nestjs/swagger';

import { MinistryRequest } from '@sp/shared-interfaces';

import { IsNumber, IsString, MinLength } from 'class-validator';

export class MinistryRequestDto implements MinistryRequest {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNumber()
  ownerID: number;
}
