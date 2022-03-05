import { ApiProperty } from '@nestjs/swagger';

import { SignInRequest } from '@sp/shared-interfaces';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInRequestDto implements SignInRequest {
  @ApiProperty({
    description: 'O email do usuário',
    default: 'gleison@teste.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
