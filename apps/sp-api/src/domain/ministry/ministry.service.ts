/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    eMinistryRole, IMinisterSongKeyListItemResponse, IMinisterSongKeyRequest,
    MinistryListItemResponse, MinistryRequest
} from '@sp/shared-interfaces';

import { Role } from '@prisma/client';
import { MinisterSongKeyListItemResponse } from 'apps/sp-api/src/domain/ministry/dtos';
import { Member, Ministry, Scale } from './models';

@Injectable()
export class MinistryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMinistry(ministryRequest: MinistryRequest): Promise<MinistryListItemResponse> {
    const defaultRolesIDs = await this.prismaService.role.findMany({
      select: {
        roleID: true,
      },
    });

    const ministry = await this.prismaService.ministry.create({
      data: {
        name: ministryRequest.name,
        ownerID: ministryRequest.ownerID,
        members: {
          create: {
            userID: ministryRequest.ownerID,
          },
        },
        roles: {
          connect: defaultRolesIDs,
        },
      },
    });

    const ministryListItem: MinistryListItemResponse = {
      ministryID: ministry.ministryID,
      name: ministry.name,
      musicsQuantity: 0,
      membersQuantity: 1,
      scalesQuantity: 0,
      songKeysQuantity: 0,
      artistQuantity: 0,
    };

    return ministryListItem;
  }

  createMinisterSongKey(ministryID: number, ministerSongKeyRequest: IMinisterSongKeyRequest) {
    const ministerSongKey = this.prismaService.ministerSongKey.create({
      data: {
        ministryID,
        songID: ministerSongKeyRequest.songID,
        memberID: ministerSongKeyRequest.memberID,
        songKeyID: ministerSongKeyRequest.keyID,
      },
    });

    return ministerSongKey;
  }

  async getMinisterSongKeysListItem(ministryID: number): Promise<MinisterSongKeyListItemResponse[]> {
    const ministerSongKeys = await this.prismaService.ministerSongKey.findMany({
      where: {
        ministryID,
      },
      include: {
        song: {
          include: {
            artist: true,
          },
        },
        member: {
          include: {
            user: {
              select: {
                imageURL: true,
                name: true,
              },
            },
          },
        },
        songKey: {
          select: {
            notation: true,
          },
        },
      },
    });

    const ministerSongKeysListItem: IMinisterSongKeyListItemResponse[] = ministerSongKeys.map((ministerSongKey) => {
      const ministerSongKeyListItem: IMinisterSongKeyListItemResponse = {
        memberImageUrl: ministerSongKey.member.user.imageURL,
        memberName: ministerSongKey.member.user.name,
        artistName: ministerSongKey.song.artist.name,
        songTitle: ministerSongKey.song.title,
        songKey: ministerSongKey.songKey.notation,
      };

      return ministerSongKeyListItem;
    });

    return ministerSongKeysListItem;
  }

  async deleteMinistry(ministryID: number): Promise<void> {
    await this.prismaService.ministry.delete({
      where: {
        ministryID,
      },
    });
  }

  async getMinistriesListItems(userID: number, ministryID?: number): Promise<MinistryListItemResponse[]> {
    const ministries = await this.prismaService.ministry.findMany({
      where: {
        ministryID: {
          equals: ministryID,
        },
        members: {
          some: {
            userID,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            scales: true,
            songs: true,
            artists: true,
            ministerSongKeys: true,
          },
        },
      },
      orderBy: {
        ministryID: 'asc',
      },
    });

    const ministryListItemMapFn = (ministry) => {
      const ministryListItem: MinistryListItemResponse = {
        ministryID: ministry.ministryID,
        name: ministry.name,
        musicsQuantity: ministry._count.songs,
        membersQuantity: ministry._count.members,
        artistQuantity: ministry._count.artists,
        scalesQuantity: ministry._count.scales,
        songKeysQuantity: ministry._count.ministerSongKeys,
      };

      return ministryListItem;
    };

    const ministriesListItems: MinistryListItemResponse[] = ministries.map(ministryListItemMapFn);
    return ministriesListItems;
  }

  async getRolesByMinistryID(ministryID: number, memberID?: number): Promise<Role[]> {
    if (memberID)
      return this.prismaService.role.findMany({
        where: {
          members: {
            some: {
              memberID,
            },
          },
        },
      });

    const roles = await this.prismaService.role.findMany({
      where: {
        ministries: {
          some: {
            ministryID,
          },
        },
      },
    });

    const rolesResponse = roles.map((role) => {
      const roleResponse = {
        roleID: role.roleID,
        name: role.name,
        iconUrl: role.iconUrl,
        isChecked: false,
      };

      return roleResponse;
    });

    return rolesResponse;
  }

  // async getScaleByIDAsync(scaleID: number): Promise<ScaleResponse> {
  //   let ministryID: number;

  //   const ministry = await this.getMinistryByScaleID(scaleID);
  //   const scale: Scale = ministry.scales.find((scale) => scale.scaleID === scaleID);

  //   if (!scale) throw new ScaleNotFoundError(ministryID, scaleID);

  //   const scaleDetail: ScaleResponse = {
  //     scaleID: scale.scaleID,
  //     title: scale.title,
  //     date: scale.date,
  //     notes: scale.notes,
  //   };

  //   return scaleDetail;
  // }

  // createMinistryKey(ministryKeyRequest: MinistryKeyRequest, id: number): MinistryKeyListItemResponse {
  //   const ministry = this.getMinistryByID(id);

  //   const song: Song = ministry.songs.find((song) => song.songID === ministryKeyRequest.songID);
  //   const member: Member = ministry.members.find((member) => member.memberID === ministryKeyRequest.memberID);

  //   const ministryKey: MinistryKey = {
  //     ministryID: ministry.ministryID,
  //     ministryKeyID: ministry.ministryKeys.length + 1,
  //     songID: song.songID,
  //     memberID: member.memberID,
  //     keyID: ministryKeyRequest.keyID,
  //   };

  //   const ministryKeyListItem: MinistryKeyListItemResponse = {
  //     ministryKeyID: ministry.ministryKeys.length + 1,
  //     artistName: song.artist.name,
  //     songKey: song.key,
  //     songTitle: song.title,
  //     memberName: member.user.name,
  //     memberImageUrl: member.user.imageUrl,
  //   };

  //   ministry.ministryKeys.push(ministryKey);

  //    this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');

  //   return ministryKeyListItem;
  // }

  // async getScales(ministryID: number): Promise<ScaleListItemResponse[]> {
  //   const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
  //   if (!ministry) throw new MinistryNotFoundError(ministryID);

  //   const imageUrlMapFn: (scale: Scale) => string[] = (scale: Scale) =>
  //     scale.participants.map((participant) => participant.member.user.imageUrl);

  //   const scales: ScaleListItemResponse[] = ministry.scales.map((scale) => {
  //     const scaleListItem: ScaleListItemResponse = {
  //       scaleID: scale.scaleID,
  //       title: scale.title,
  //       date: scale.date,
  //       imagesUrl: imageUrlMapFn(scale),
  //       notes: scale.notes,
  //       songsQuantity: scale.songs.length,
  //     };

  //     return scaleListItem;
  //   });

  //   return scales;
  // }

  // async getParticipants(ministryID: number, scaleID: number): Promise<any[]> {
  //   const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
  //   if (!ministry) throw new MinistryNotFoundError(ministryID);

  //   const scale = ministry.scales.find((scale) => scale.scaleID === scaleID);
  //   if (!scale) throw new ScaleNotFoundError(ministryID, scaleID);

  //   const ministryMembers: Member[] = ministry.members;

  //   const participants = ministryMembers.map((member) => {
  //     const participantID = scale.participants.find(
  //       (participant) => participant.memberID === member.memberID
  //     )?.participantID;

  //     return {
  //       ...member,
  //       participantID,
  //     };
  //   });

  //   return participants;
  // }

  // async getKeyListItems(ministryID: number): Promise<MinistryKeyListItemResponse[]> {
  //   const ministry = {} as any;
  //   if (!ministry) throw new MinistryNotFoundError(ministryID);

  //   const keys: MinistryKeyListItemResponse[] = ministry.ministryKeys.map((ministryKey) => {
  //     const songs = ministry.songs.filter((song) => song.songID === ministryKey.songID);

  //     if (songs.length > 1) throw new MultipleSongsFoundError(ministryKey.songID);

  //     const [song] = songs;

  //     const ministryKeyLabel = SONG_KEYS.find((key) => key.keyID === ministryKey.keyID).key;

  //     const member = ministry.members.find((member) => member.memberID === ministryKey.memberID);

  //     const keyListItem: MinistryKeyListItemResponse = {
  //       ministryKeyID: ministryKey.ministryKeyID,
  //       memberName: member.user.name,
  //       songTitle: song.title,
  //       artistName: song.artist.name,
  //       memberImageUrl: member.user.imageUrl,
  //       songKey: ministryKeyLabel,
  //     };

  //     return keyListItem;
  //   });

  //   return keys;
  // }

  // async deleteScale(scaleID: number): Promise<void> {
  //   const ministry = this.ministries.find((ministry) => {
  //     const scale = ministry.scales.find((scale) => scale.scaleID === scaleID);
  //     if (!scale) throw new ScaleNotFoundError(ministry.ministryID, scaleID);
  //     return ministry;
  //   });

  //   ministry.scales = ministry.scales.filter((scale) => scale.scaleID !== scaleID);

  //   this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');
  // }

  // private getMinistryKeyName(ministry: Ministry, song: Song, minister: Member): string {
  //   if (!minister) return null;

  //   const ministryKey = ministry.ministryKeys.find((ministryKey) => {
  //     const hasMinistryKey =
  //       ministryKey.songID === song.songID &&
  //       ministryKey.memberID === minister.memberID &&
  //       ministryKey.ministryID === ministry.ministryID;

  //     return hasMinistryKey;
  //   });

  //   if (!ministryKey) return `Não possui tom cadastrado para o ministro(a) ${minister.user.name}`;

  //   const keyName = SONG_KEYS.find((key) => key.keyID === ministryKey.keyID).key;
  //   return keyName;
  // }

  private getMinistryByID(ministryID: number): Ministry {
    // const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);

    // if (!ministry) throw new MinistryNotFoundError(ministryID);
    // return ministry;
    return null;
  }

  private findMinister(scale: Scale): Member {
    const isMinisterPredicate: (role: Role) => boolean = ({ roleID }: Role) => roleID === eMinistryRole.MINISTER;

    const minister: Member = scale.participants.find((participant) => {
      const isMinister = participant.member.roles.some(isMinisterPredicate);
      return isMinister;
    }).member;

    return minister;
  }

  // private async getMinistryByScaleID(scaleID: number): Promise<Ministry> {
  //   const ministries = await this.ministryRepository.getDataBase();
  //   const ministry = ministries.ministriesMock.find((ministry) => {
  //     const scale = ministry.scales.find((scale) => scale.scaleID === scaleID);
  //     if (!scale) throw new ScaleNotFoundError(ministry.ministryID, scaleID);

  //     return true;
  //   });

  //   if (!ministry) throw new MinistryByScaleNotFoundError(scaleID);
  //   return ministry;
  // }
}
