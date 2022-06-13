import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    ParticipantListItem, ParticipantListItemRole, ParticipantRequest, RoleResponse,
    ScaleDetailResponse, ScaleListItemResponse, ScaleRequest, ScaleResponse
} from '@sp/shared-interfaces';

import { MemberListItemResponseDto } from 'apps/sp-api/src/domain/member/dtos';
import { ScaleRequestDto } from 'apps/sp-api/src/domain/scale/dto/scale.dto';

@Injectable()
export class ScaleService {
  //     roleID: 1}
  // ]

  constructor(private readonly prismaService: PrismaService) {}

  async create(ministryID: number, scaleRequest: ScaleRequest): Promise<ScaleResponse> {
    const scale = await this.prismaService.scale.create({
      data: {
        title: scaleRequest.title,
        notes: scaleRequest.notes,
        date: scaleRequest.date,
        ministryID,
      },
    });

    const scaleResponse: ScaleResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      notes: scale.notes,
      date: scale.date,
    };

    return scaleResponse;
  }

  update(scaleID: number, scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
    return this.prismaService.scale.update({
      where: { scaleID },
      data: {
        title: scaleRequest.title,
        notes: scaleRequest.notes,
        date: scaleRequest.date,
      },
    });
  }

  async findOne(ministryID: number, scaleID: number): Promise<ScaleDetailResponse> {
    const scale = await this.prismaService.scale.findFirst({
      where: {
        scaleID,
        ministryID,
      },
      include: {
        scaleSongs: true,
        participants: true,
      },
    });

    const scaleDetailResponse: ScaleDetailResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      date: scale.date,
      songs: [],
      participants: [],
      notes: scale.notes,
    };

    return scaleDetailResponse;
  }

  //   imageUrl: "https://i.pravatar.cc/150?img=38"
  // memberID: 2
  // name: "Debora"
  // roles: [
  // {      iconUrl: "assets/images/roles/microphone.svg"
  //     name: "Ministro"
  //     roleID: 1}
  // ]

  async findParticipants(ministryID: number, scaleID: number): Promise<any> {
    const members = await this.prismaService.member.findMany({
      where: {
        ministryID,
      },
      select: {
        memberID: true,
        roles: true,
        user: true,
        participants: {
          where: {
            scaleID,
          },
          select: {
            participantID: true,
            participantRole: {
              select: {
                roleID: true,
              },
            },
          },
        },
      },
    });

    const membersResponse: MemberListItemResponseDto[] = members.map((member) => {
      const memberResponse: MemberListItemResponseDto = {
        imageUrl: member.user.imageURL,
        memberID: member.memberID,
        name: member.user.name,
        participantID: member.participants[0]?.participantID,
        roles: member.roles.map((role) => {
          const roleResponse: RoleResponse = {
            iconUrl: role.iconUrl,
            name: role.name,
            roleID: role.roleID,
            isChecked: !!member.participants[0]?.participantRole.find(
              (participantRole) => participantRole.roleID === role.roleID
            ),
          };

          return roleResponse;
        }),
      };

      return memberResponse;
    });

    return membersResponse;
  }

  async findParticipantListItems(ministryID: number, scaleID: number): Promise<any> {
    const participants = await this.prismaService.participant.findMany({
      where: {
        scaleID,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
        participantRole: {
          include: {
            role: true,
          },
        },
      },
    });

    const participantListItems: ParticipantListItem[] = participants.map((participant) => {
      const participantListItem: ParticipantListItem = {
        name: participant.member.user.name,
        imageUrl: participant.member.user.imageURL,
        roles: participant.participantRole.map((participantRole) => {
          const roleResponse: ParticipantListItemRole = {
            iconUrl: participantRole.role.iconUrl,
            name: participantRole.role.name,
            roleID: participantRole.roleID,
          };

          return roleResponse;
        }),
      };

      return participantListItem;
    });

    return participantListItems;
  }

  async findAll(ministryID: number): Promise<ScaleListItemResponse[]> {
    const scales = await this.prismaService.scale.findMany({
      where: { ministryID },
      include: {
        scaleSongs: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const scaleListItemResponses: ScaleListItemResponse[] = scales.map((scale) => {
      const scaleListItemResponse: ScaleListItemResponse = {
        scaleID: scale.scaleID,
        title: scale.title,
        notes: scale.notes,
        songsQuantity: scale.scaleSongs.length,
        date: scale.date,
        imagesUrl: [],
      };

      return scaleListItemResponse;
    });

    return scaleListItemResponses;
  }

  async createParticipant(participantRequest: ParticipantRequest[]): Promise<any> {
    const { toUpdate, toDelete, toCreate } = participantRequest.reduce(
      (acc, participant) => {
        const shouldDelete = !!participant.participantID && !participant.selected;
        const shouldUpdate = !!participant.participantID && participant.selected;

        if (shouldDelete) acc.toDelete.push(participant);
        if (shouldUpdate) acc.toUpdate.push(participant);
        if (!participant.participantID) acc.toCreate.push(participant);

        return acc;
      },
      { toDelete: [], toUpdate: [], toCreate: [] }
    );

    if (toDelete.length > 0) {
      await this.prismaService.participant.deleteMany({
        where: {
          participantID: {
            in: toDelete.map((participant) => participant.participantID),
          },
        },
      });
    }

    if (toCreate.length > 0) {
      toCreate.forEach(async (participant) => {
        await this.prismaService.participant.create({
          data: {
            memberID: participant.memberID,
            scaleID: participant.scaleID,
            participantRole: {
              createMany: {
                data: participant.roles.map((role) => ({
                  roleID: role,
                })),
              },
            },
          },
        });
      });
    }

    if (toUpdate.length > 0) {
      toUpdate.forEach(async (participant) => {
        await this.prismaService.participantRole.deleteMany({
          where: {
            participantID: participant.participantID,
          },
        });

        await this.prismaService.participant.update({
          where: {
            participantID: participant.participantID,
          },
          data: {
            participantRole: {
              createMany: {
                data: participant.roles.map((role) => ({
                  roleID: role,
                })),
              },
            },
          },
        });
      });
    }
  }
}
