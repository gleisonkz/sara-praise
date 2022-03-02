import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

import { SignUpResponse } from '@sp/shared-interfaces';

import { Response } from 'express';
import { UnauthenticatedUserError } from './auth.error';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in.dto';
import { SignUpRequestDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpRequest: SignUpRequestDto): Promise<SignUpResponse> {
    try {
      return await this.authService.signUp(signUpRequest);
    } catch (error) {
      console.log({
        error,
      });
    }
  }

  @Post('signin')
  async signIn(
    @Body() signInRequest: SignInRequestDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SignUpResponse> {
    try {
      const user = await this.authService.signIn(signInRequest);
      return user;
    } catch (error) {
      if (error instanceof UnauthenticatedUserError) {
        return res.status(HttpStatus.UNAUTHORIZED).json(error.message);
      }

      throw error;
    }
  }
}
