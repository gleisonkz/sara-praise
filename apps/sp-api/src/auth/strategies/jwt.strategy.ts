import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserAuthPayload } from '@sp/shared-interfaces';

import { PrismaService } from 'apps/sp-api/src/prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserAuthPayload): Promise<UserAuthPayload> {
    const user = await this.prismaService.user.findUnique({
      where: {
        userID: payload.userID,
      },
    });

    return {
      userID: user.userID,
      username: user.name,
      email: user.email,
    };
  }
}
