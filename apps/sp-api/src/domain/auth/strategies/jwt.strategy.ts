import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { PrismaService } from '@sp/api/domain/prisma';
import { UserAuthPayload } from '@sp/shared-interfaces';

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
