/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignUpResponse } from '@sp/shared-interfaces';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { eAuthMessage } from 'apps/sp-api/src/shared';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/sign-in.dto';
import { SignUpRequestDto } from './dtos/sign-up.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequestDto): Promise<SignUpResponse> {
    try {
      return await this.authService.signUp(signUpRequest);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new HttpException(eAuthMessage.EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

      throw error;
    }
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInRequest: SignInRequestDto): Promise<{
    access_token: string;
  }> {
    const user = await this.authService.signIn(signInRequest);
    return user;
  }
}
