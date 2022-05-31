/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import { eMinistryRole, MemberListItemResponse } from '@sp/shared-interfaces';

import { MemberRequestDto } from 'apps/sp-api/src/domain/member/dtos';
import * as argon from 'argon2';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(ministryID: number, memberRequestDto: MemberRequestDto) {
    const passwordHash = await argon.hash(memberRequestDto.password);

    const user = await this.prismaService.user.create({
      data: {
        name: memberRequestDto.name,
        imageURL: memberRequestDto.imageUrl,
        email: memberRequestDto.email,
        password: passwordHash,
        member: {
          create: {
            ministryID,
            roles: {
              connect: memberRequestDto.roles.map((role) => ({ roleID: role })),
            },
          },
        },
      },
      include: {
        member: {
          where: {
            ministryID,
          },
        },
      },
    });

    const memberListItem = {
      memberID: user.member[0].memberID,
      name: user.name,
      imageUrl: memberRequestDto.imageUrl,
    };

    return memberListItem;
  }

  async getMembers(ministryID: number, roles?: eMinistryRole[]) {
    const rolesPredicate = roles
      ? {
          roles: {
            some: {
              roleID: {
                in: roles,
              },
            },
          },
        }
      : {};

    const ministry = await this.prismaService.ministry.findUnique({
      where: {
        ministryID,
      },
      select: {
        members: {
          include: {
            roles: true,
          },
          where: rolesPredicate,
        },
      },
    });

    console.log({ ministry });

    const memberListItems = ministry.members.map(async (member) => {
      const user = await this.prismaService.user.findUnique({
        where: {
          userID: member.userID,
        },
      });

      console.log({ roles: member.roles });

      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: user.name,
        imageUrl: user.imageURL,
        roles: member.roles as any,
      };

      return memberListItem;
    });

    console.log({ memberListItems });

    return Promise.all(memberListItems);
  }
}
