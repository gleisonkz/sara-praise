import { ApiProperty } from '@nestjs/swagger';

import { SignUpRequest } from '@sp/shared-interfaces';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpRequestDto implements SignUpRequest {
  @ApiProperty({
    description: 'O nome do usuário a ser criado',
    default: 'gleison',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'O email do usuário a ser criado',
    default: 'gleison@teste.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A senha do usuário a ser criada',
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
