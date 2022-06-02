import { ApiProperty } from '@nestjs/swagger';

import { ScaleRequest } from '@sp/shared-interfaces';

import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class ScaleRequestDto implements ScaleRequest {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes?: string;
}
