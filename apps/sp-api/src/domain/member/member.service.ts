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
        members: {
          create: {
            ministryID,
            roles: {
              connect: memberRequestDto.roles.map((role) => ({ roleID: role })),
            },
          },
        },
      },
      include: {
        members: {
          where: {
            ministryID,
          },
        },
      },
    });

    const memberListItem = {
      memberID: user.members[0].memberID,
      name: user.name,
      imageUrl: memberRequestDto.imageUrl,
    };

    return memberListItem;
  }

  async remove(memberID: number) {
    await this.prismaService.member.delete({
      where: {
        memberID,
      },
    });
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

    const memberListItems = ministry.members.map(async (member) => {
      const user = await this.prismaService.user.findUnique({
        where: {
          userID: member.userID,
        },
      });

      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: user.name,
        imageUrl: user.imageURL,
        roles: member.roles as any,
      };

      return memberListItem;
    });

    return Promise.all(memberListItems);
  }

  async update(memberID: number, memberRequestDto: MemberRequestDto): Promise<MemberListItemResponse> {
    await this.prismaService.member.update({
      where: {
        memberID,
      },
      data: {
        roles: {
          set: memberRequestDto.roles.map((role) => ({ roleID: role })),
        },
      },
    });

    const member = await this.prismaService.member.update({
      where: {
        memberID,
      },
      data: {
        roles: {
          connect: memberRequestDto.roles.map((role) => ({ roleID: role })),
        },
        user: {
          update: {
            name: memberRequestDto.name,
            imageURL: memberRequestDto.imageUrl,
          },
        },
      },
      include: {
        user: true,
        roles: true,
      },
    });

    const memberListItem: MemberListItemResponse = {
      memberID: member.memberID,
      name: member.user.name,
      imageUrl: memberRequestDto.imageUrl,
      roles: member.roles as any,
    };

    return memberListItem;
  }

  async findByID(memberID: number): Promise<MemberListItemResponse> {
    const member = await this.prismaService.member.findUnique({
      where: {
        memberID,
      },
      include: {
        user: true,
      },
    });

    const memberListItem: any = {
      memberID: member.memberID,
      name: member.user.name,
      imageUrl: member.user.imageURL,
    };

    return memberListItem as any;
  }
}
