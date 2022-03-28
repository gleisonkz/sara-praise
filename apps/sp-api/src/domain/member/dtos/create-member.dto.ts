import { ApiProperty } from '@nestjs/swagger';

import { MemberRequest } from '@sp/shared-interfaces';

import { IsNumber, IsString } from 'class-validator';

export class MemberRequestDto implements MemberRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsNumber({}, { each: true })
  roles: number[];
}
