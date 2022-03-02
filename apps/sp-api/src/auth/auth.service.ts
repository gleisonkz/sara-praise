import { Injectable } from '@nestjs/common';

import { SignUpRequest, SignUpResponse } from '@sp/shared-interfaces';

import { PrismaService } from 'apps/sp-api/src/prisma/prisma.service';
import * as argon from 'argon2';
import { UnauthenticatedUserError } from './auth.error';
import { SignInRequestDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signIn(userRequest: SignInRequestDto): Promise<SignUpResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (!user) throw new UnauthenticatedUserError();

    const passwordMatches = await argon.verify(user.password, userRequest.password);
    if (!passwordMatches) throw new UnauthenticatedUserError();

    const responseUser: SignUpResponse = {
      userID: user.userID,
      name: user.name,
      email: user.email,
    };

    return responseUser;
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
}
