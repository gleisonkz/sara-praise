import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    AvailableScaleSongResponse, eMinistryRole, MemberListItemResponse, ParticipantListItem,
    ParticipantListItemRole, ParticipantRequest, ParticipantSelectItemResponse, RoleResponse,
    ScaleDetailResponse, ScaleListItemResponse, ScaleRequest, ScaleResponse, ScaleSongRequest,
    ScaleSongResponse
} from '@sp/shared-interfaces';

import { MemberListItemResponseDto } from 'apps/sp-api/src/domain/member/dtos';
import { ScaleRequestDto } from 'apps/sp-api/src/domain/scale/dto/scale.dto';

@Injectable()
export class ScaleService {
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

  async remove(scaleID: number): Promise<boolean> {
    const scale = await this.prismaService.scale.delete({
      where: {
        scaleID,
      },
    });

    return !!scale;
  }

  async update(scaleID: number, scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
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
        scaleSongs: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
            song: {
              include: {
                artist: true,
              },
            },
          },
        },
        participants: {
          include: {
            participantRole: {
              include: {
                role: true,
              },
            },
            member: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const songs: ScaleSongResponse[] = scale?.scaleSongs.map((scaleSong) => {
      const songResponse: ScaleSongResponse = {
        scaleSongID: scaleSong.scaleSongID,
        artistName: scaleSong.song.artist.name,
        hasAudioLink: !!scaleSong.song.audioUrl,
        hasChordsLink: !!scaleSong.song.chordsUrl,
        hasLyricLink: !!scaleSong.song.lyricUrl,
        hasYoutubeLink: !!scaleSong.song.youtubeUrl,
        key: scaleSong.ministerSongKey,
        songID: scaleSong.songID,
        tags: scaleSong.song.tags,
        title: scaleSong.song.title,
        memberID: scaleSong.member.memberID,
        memberName: scaleSong.member.user.name,
        memberImageUrl: scaleSong.member.user.imageURL,
      };

      return songResponse;
    });

    const participants: MemberListItemResponse[] = scale?.participants.map((participant) => {
      const participantResponse: MemberListItemResponse = {
        imageUrl: participant.member.user.imageURL,
        name: participant.member.user.name,
        memberID: participant.member.memberID,
        participantID: participant.participantID,
        roles: participant.participantRole.map((participantRole) => {
          const roleResponse: any = {
            roleID: participantRole.roleID,
            name: participantRole.role.name,
            iconUrl: participantRole.role.iconUrl,
          };

          return roleResponse;
        }),
      };

      return participantResponse;
    });

    const scaleDetailResponse: ScaleDetailResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      date: scale.date,
      songs,
      participants,
      notes: scale.notes,
    };

    return scaleDetailResponse;
  }

  async findAll(ministryID: number): Promise<ScaleListItemResponse[]> {
    const scales = await this.prismaService.scale.findMany({
      where: { ministryID },
      include: {
        participants: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
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
        participants: scale.participants.map((participant) => ({ imageUrl: participant.member.user.imageURL })),
      };

      return scaleListItemResponse;
    });

    return scaleListItemResponses;
  }

  async findParticipants(ministryID: number, scaleID: number): Promise<MemberListItemResponseDto[]> {
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

  async findAllParticipantsByRoleID(scaleID: number, roleID: eMinistryRole): Promise<ParticipantSelectItemResponse[]> {
    const participants = await this.prismaService.participant.findMany({
      where: {
        scaleID,
        participantRole: {
          some: {
            roleID,
          },
        },
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    return participants.map((participant) => {
      const participantResponse: ParticipantSelectItemResponse = {
        participantID: participant.participantID,
        memberID: participant.member.memberID,
        name: participant.member.user.name,
      };

      return participantResponse;
    });
  }

  async findParticipantListItems(scaleID: number): Promise<ParticipantListItem[]> {
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
        participantID: participant.participantID,
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

  async upsertParticipants(participantRequest: ParticipantRequest[]): Promise<any> {
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

  async removeParticipant(participantID: number): Promise<boolean> {
    const participant = await this.prismaService.participant.delete({
      where: {
        participantID,
      },
    });

    return !!participant;
  }

  async findSongs(scaleID: number): Promise<ScaleSongResponse[]> {
    const songs = await this.prismaService.scaleSong.findMany({
      where: {
        scaleID,
      },
      select: {
        scaleSongID: true,
        songID: true,
        ministerSongKey: true,
        artistName: true,
        songTitle: true,
        song: true,
        member: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scaleSongID: 'asc',
      },
    });

    const songsResponse: ScaleSongResponse[] = songs.map((scaleSong) => {
      const songResponse: ScaleSongResponse = {
        scaleSongID: scaleSong.scaleSongID,
        artistName: scaleSong.artistName,
        hasAudioLink: !!scaleSong.song.audioUrl,
        hasChordsLink: !!scaleSong.song.chordsUrl,
        hasLyricLink: !!scaleSong.song.lyricUrl,
        hasYoutubeLink: !!scaleSong.song.youtubeUrl,
        key: scaleSong.ministerSongKey,
        songID: scaleSong.songID,
        tags: scaleSong.song.tags,
        title: scaleSong.songTitle,
        memberID: scaleSong.member.memberID,
        memberName: scaleSong.member.user.name,
        memberImageUrl: scaleSong.member.user.imageURL,
      };

      return songResponse;
    });

    return songsResponse;
  }

  async findAvailableSongs(ministryID: number, scaleID: number): Promise<AvailableScaleSongResponse[]> {
    const songs = await this.prismaService.song.findMany({
      where: {
        ministryID,
      },
      select: {
        songID: true,
        title: true,
        artist: true,
        audioUrl: true,
        youtubeUrl: true,
        key: true,
        tags: true,
        lyricUrl: true,
        chordsUrl: true,
        scaleSongs: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
          where: {
            scaleID,
          },
        },
      },
    });

    const songsResponse: AvailableScaleSongResponse[] = songs.map((song) => {
      const songResponse: AvailableScaleSongResponse = {
        scaleSongID: song.scaleSongs[0]?.scaleSongID,
        member: {
          memberID: song.scaleSongs[0]?.memberID,
          memberName: song.scaleSongs[0]?.member.user.name,
        },
        songID: song.songID,
        title: song.title,
        artistName: song.artist.name,
        tags: song.tags,
        key: song.key.notation,
        hasAudioLink: !!song.audioUrl,
        hasYoutubeLink: !!song.youtubeUrl,
        hasLyricLink: !!song.lyricUrl,
        hasChordsLink: !!song.chordsUrl,
        isChecked: song.scaleSongs.length > 0,
      };

      return songResponse;
    });

    return songsResponse;
  }

  async upsertSongs(scaleSongsRequest: ScaleSongRequest[]): Promise<any> {
    const {
      toUpdate,
      toDelete,
      toCreate,
    }: { toUpdate: ScaleSongRequest[]; toDelete: ScaleSongRequest[]; toCreate: ScaleSongRequest[] } =
      scaleSongsRequest.reduce(
        (acc, scaleSong) => {
          const shouldDelete = !!scaleSong.scaleSongID && !scaleSong.isChecked;
          const shouldUpdate = !!scaleSong.scaleSongID && scaleSong.isChecked;

          if (shouldDelete) acc.toDelete.push(scaleSong);
          if (shouldUpdate) acc.toUpdate.push(scaleSong);
          if (!scaleSong.scaleSongID) acc.toCreate.push(scaleSong);
          return acc;
        },
        { toDelete: [], toUpdate: [], toCreate: [] }
      );

    if (toDelete.length > 0) {
      await this.prismaService.scaleSong.deleteMany({
        where: {
          scaleSongID: {
            in: toDelete.map((scaleSong) => scaleSong.scaleSongID),
          },
        },
      });
    }

    if (toCreate.length > 0) {
      toCreate.forEach(async (scaleSong) => {
        const ministerSongKey = await this.prismaService.ministerSongKey.findFirst({
          where: {
            songID: scaleSong.songID,
            memberID: scaleSong.memberID,
          },
          include: {
            songKey: true,
          },
        });

        await this.prismaService.scaleSong.create({
          data: {
            scaleID: scaleSong.scaleID,
            songID: scaleSong.songID,
            memberID: scaleSong.memberID,
            artistName: scaleSong.artistName,
            songTitle: scaleSong.songTitle,
            ministerSongKey:
              ministerSongKey?.songKey?.notation ??
              (
                await this.prismaService.song.findFirst({
                  where: {
                    songID: scaleSong.songID,
                  },
                  include: {
                    key: true,
                  },
                })
              ).key.notation,
          },
        });
      });
    }

    if (toUpdate.length > 0) {
      toUpdate.forEach(async (scaleSong) => {
        const ministerSongKey = await this.prismaService.ministerSongKey.findFirst({
          where: {
            songID: scaleSong.songID,
            memberID: scaleSong.memberID,
          },
          include: {
            songKey: true,
          },
        });

        const updated = await this.prismaService.scaleSong.update({
          where: {
            scaleSongID: scaleSong.scaleSongID,
          },
          data: {
            scaleID: scaleSong.scaleID,
            songID: scaleSong.songID,
            memberID: scaleSong.memberID,
            artistName: scaleSong.artistName,
            songTitle: scaleSong.songTitle,
            ministerSongKey: ministerSongKey.songKey.notation,
          },
        });

        return updated;
      });
    }
  }
}
