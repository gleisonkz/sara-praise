import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@sp/api/domain/prisma';
import { SignUpRequest, SignUpResponse, TokenResponse } from '@sp/shared-interfaces';

import { eAuthMessage } from 'apps/sp-api/src/shared';
import * as argon from 'argon2';
import { SignInRequestDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

  async signIn(userRequest: SignInRequestDto): Promise<TokenResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (!user) throw new HttpException(eAuthMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const passwordMatches = await argon.verify(user.password, userRequest.password);
    if (!passwordMatches) throw new HttpException(eAuthMessage.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const responseUser: SignUpResponse = {
      userID: user.userID,
      name: user.name,
      email: user.email,
    };

    const token = await this.generateToken(responseUser);
    return token;
  }

  async signUp(userRequest: SignUpRequest): Promise<TokenResponse> {
    const passwordHash = await argon.hash(userRequest.password);

    const user = await this.prismaService.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: passwordHash,
      },
      select: {
        userID: true,
        email: true,
        name: true,
      },
    });

    const token = await this.generateToken(user);
    return token;
  }

  private async generateToken(user: SignUpResponse): Promise<TokenResponse> {
    const payload = {
      userID: user.userID,
      email: user.email,
      name: user.name,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });

    return { accessToken: token };
  }
}
