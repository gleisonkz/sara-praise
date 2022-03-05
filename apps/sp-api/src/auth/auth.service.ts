import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUpRequest, SignUpResponse } from '@sp/shared-interfaces';

import { PrismaService } from 'apps/sp-api/src/prisma/prisma.service';
import { eAuthMessage } from 'apps/sp-api/src/shared';
import * as argon from 'argon2';
import { SignInRequestDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}

  async signIn(userRequest: SignInRequestDto): Promise<{ access_token: string }> {
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

    const access_token = await this.signToken(responseUser);
    return { access_token };
  }

  async signUp(userRequest: SignUpRequest): Promise<SignUpResponse> {
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

    return user;
  }

  private signToken(user: SignUpResponse): Promise<string> {
    const payload = {
      sub: user.userID,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
  }
}
