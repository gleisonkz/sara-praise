/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    IMinisterSongKeyListItemResponse, IMinisterSongKeyRequest, MinistryListItemResponse,
    MinistryRequest
} from '@sp/shared-interfaces';

import { Role } from '@prisma/client';
import { MinisterSongKeyListItemResponse } from 'apps/sp-api/src/domain/ministry/dtos';
import * as fs from 'fs';

@Injectable()
export class MinistryService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateSeed() {
    const artists = await this.prismaService.artist.findMany();
    const ministries = await this.prismaService.ministry.findMany();
    const roles = await this.prismaService.role.findMany();
    const songKeys = await this.prismaService.songKey.findMany();
    const songs = await this.prismaService.song.findMany();
    const ministerSongKeys = await this.prismaService.ministerSongKey.findMany();

    fs.writeFileSync('prisma/seeds/ministries.seed.ts', `export const MINISTRIES = ${JSON.stringify(ministries, null, 2)}`);
    fs.writeFileSync('prisma/seeds/artists.seed.ts', `export const ARTISTS = ${JSON.stringify(artists, null, 2)}`);
    fs.writeFileSync('prisma/seeds/roles.seed.ts', `export const DEFAULT_ROLES = ${JSON.stringify(roles, null, 2)}`);
    fs.writeFileSync('prisma/seeds/song-keys.seed.ts', `export const SONG_KEYS = ${JSON.stringify(songKeys, null, 2)}`);
    fs.writeFileSync('prisma/seeds/songs.seed.ts', `export const SONGS = ${JSON.stringify(songs, null, 2)}`);
    fs.writeFileSync(
      'prisma/seeds/minister-song-keys.seed.ts',
      `export const MINISTER_SONG_KEYS = ${JSON.stringify(ministerSongKeys, null, 2)}`
    );
  }

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
      songsQuantity: 0,
      membersQuantity: 1,
      scalesQuantity: 0,
      songKeysQuantity: 0,
      artistQuantity: 0,
    };

    return ministryListItem;
  }

  async createMinisterSongKey(ministryID: number, ministerSongKeyRequest: IMinisterSongKeyRequest) {
    const ministerSongKey = await this.prismaService.ministerSongKey.create({
      data: {
        ministryID,
        songID: ministerSongKeyRequest.songID,
        memberID: ministerSongKeyRequest.memberID,
        songKeyID: ministerSongKeyRequest.keyID,
      },

      include: {
        song: {
          include: {
            artist: true,
          },
        },
        songKey: true,
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    const ministerSongKeyListItemResponse: MinisterSongKeyListItemResponse = {
      artistName: ministerSongKey.song.artist.name,
      songTitle: ministerSongKey.song.title,
      songKey: ministerSongKey.songKey.notation,
      songKeyID: ministerSongKey.songKey.songKeyID,
      memberImageUrl: ministerSongKey.member.user.imageURL,
      memberName: ministerSongKey.member.user.name,
      memberID: ministerSongKey.member.memberID,
      songID: ministerSongKey.song.songID,
    };

    return ministerSongKeyListItemResponse;
  }

  async deleteMinisterSongKey(ministryID: number, memberID: number, songID: number): Promise<void> {
    await this.prismaService.ministerSongKey.deleteMany({
      where: {
        ministryID,
        memberID,
        songID,
      },
    });
  }

  async hasMinisterSongKey(ministryID: number, memberID: number, songID: number) {
    const ministerSongKey = await this.prismaService.ministerSongKey.findFirst({
      where: {
        ministryID,
        memberID,
        songID,
      },
    });

    return !!ministerSongKey;
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
            songKeyID: true,
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
        songKeyID: ministerSongKey.songKey.songKeyID,
        memberID: ministerSongKey.member.memberID,
        songID: ministerSongKey.song.songID,
      };

      return ministerSongKeyListItem;
    });

    return ministerSongKeysListItem;
  }

  async getMinisterSongKeyBySongID(ministryID: number, memberID: number, songID: number) {
    const ministerSongKey = await this.prismaService.ministerSongKey.findFirst({
      where: {
        ministryID,
        memberID,
        songID,
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
            songKeyID: true,
          },
        },
      },
    });

    console.log({ ministerSongKey });

    const ministerSongKeyListItemResponse: MinisterSongKeyListItemResponse = {
      artistName: ministerSongKey.song.artist.name,
      songTitle: ministerSongKey.song.title,
      songKey: ministerSongKey.songKey.notation,
      songKeyID: ministerSongKey.songKey.songKeyID,
      memberImageUrl: ministerSongKey.member.user.imageURL,
      memberName: ministerSongKey.member.user.name,
      memberID: ministerSongKey.member.memberID,
      songID: ministerSongKey.song.songID,
    };

    return ministerSongKeyListItemResponse;
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
          equals: ministryID || undefined,
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
        songsQuantity: ministry._count.songs,
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
    const roles = await this.prismaService.role.findMany({
      where: {
        ministries: {
          some: {
            ministryID: ministryID,
          },
        },
      },
    });

    const memberRoles = await this.prismaService.role.findMany({
      where: {
        members: {
          some: {
            memberID: memberID,
          },
        },
      },
    });

    const rolesResponse = roles.map((role) => {
      const roleResponse = {
        roleID: role.roleID,
        name: role.name,
        iconUrl: role.iconUrl,
        isChecked: memberRoles.some((memberRole) => memberRole.roleID === role.roleID),
      };

      return roleResponse;
    });

    return rolesResponse;
  }

  async getKeys() {
    return this.prismaService.songKey.findMany({
      orderBy: {
        songKeyID: 'asc',
      },
    });
  }
}
