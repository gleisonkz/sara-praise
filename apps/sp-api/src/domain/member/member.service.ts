/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import { eMinistryRole, MemberListItemResponse } from '@sp/shared-interfaces';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

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
        roles: member.roles,
      };

      return memberListItem;
    });

    return Promise.all(memberListItems);
  }
}
