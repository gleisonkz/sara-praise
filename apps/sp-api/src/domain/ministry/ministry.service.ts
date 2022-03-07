/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    eMinistryRole, MemberListItemResponse, MinistryKeyListItemResponse, MinistryKeyRequest,
    MinistryListItemResponse, MinistryRequest, Role, SongListItemResponse
} from '@sp/shared-interfaces';

import { MinistryListItemResponseDto } from './dtos';
import { MinistryNotFoundError, MultipleSongsFoundError } from './ministry.error';
import { DEFAULT_ROLES, KEYS } from './mocks';
import { Member, Ministry, MinistryKey, Scale, Song } from './models';

@Injectable()
export class MinistryService {
  constructor(private readonly prismaService: PrismaService) {}

  // async createScale(ministryID: number, scaleRequest: ScaleRequest): Promise<number> {
  //   const ministry = this.getMinistryByID(ministryID);

  //   const nextScaleID = ministry.scales.length + 1;

  //   const scale: Scale = {
  //     scaleID: nextScaleID,
  //     title: scaleRequest.title,
  //     date: scaleRequest.date,
  //     notes: scaleRequest.notes,
  //     songs: [],
  //     participants: [],
  //   };

  //   ministry.scales.push(scale);
  //   this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');

  //   return nextScaleID;
  // }

  async createMinistry(ministryRequest: MinistryRequest): Promise<MinistryListItemResponseDto> {
    const ministry = await this.prismaService.ministry.create({
      data: {
        name: ministryRequest.name,
        ownerID: ministryRequest.ownerID,
      },
    });

    await this.prismaService.member.create({
      data: {
        userID: ministryRequest.ownerID,
        ministryID: ministry.ministryID,
      },
    });

    const ministryListItem: MinistryListItemResponseDto = {
      ministryID: ministry.ministryID,
      name: ministry.name,
      musicsQuantity: 0,
      membersQuantity: 1,
      scalesQuantity: 0,
      songKeysQuantity: 0,
    };

    return ministryListItem;
  }

  async deleteMinistry(ministryID: number): Promise<void> {
    return null;
  }

  async getRolesByMinistryID(ministryID: number, memberID?: number): Promise<Role[]> {
    const ministry = this.getMinistryByID(ministryID);
    const member = ministry.members.find((member) => member.memberID === memberID);
    if (!memberID)
      return DEFAULT_ROLES.map((role) => {
        const roleListItem = {
          ...role,
          isChecked: false,
        };

        return roleListItem;
      });
    const roles = DEFAULT_ROLES;

    return roles;
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

  createMinistryKey(ministryKeyRequest: MinistryKeyRequest, id: number): MinistryKeyListItemResponse {
    const ministry = this.getMinistryByID(id);

    const song: Song = ministry.songs.find((song) => song.songID === ministryKeyRequest.songID);
    const member: Member = ministry.members.find((member) => member.memberID === ministryKeyRequest.memberID);

    const ministryKey: MinistryKey = {
      ministryID: ministry.ministryID,
      ministryKeyID: ministry.ministryKeys.length + 1,
      songID: song.songID,
      memberID: member.memberID,
      keyID: ministryKeyRequest.keyID,
    };

    const ministryKeyListItem: MinistryKeyListItemResponse = {
      ministryKeyID: ministry.ministryKeys.length + 1,
      artistName: song.artist.name,
      songKey: song.key,
      songTitle: song.title,
      memberName: member.user.name,
      memberImageUrl: member.user.imageUrl,
    };

    ministry.ministryKeys.push(ministryKey);

    // this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');

    return ministryKeyListItem;
  }

  async getMinistriesListItems(ministryID?: number): Promise<MinistryListItemResponse[]> {
    const ministryListItemMapFn = (ministry: any) => {
      const ministryListItem: MinistryListItemResponse = {
        ministryID: ministry.ministryID,
        name: ministry.name,
        musicsQuantity: ministry._count.Songs,
        membersQuantity: ministry._count.Members,
        scalesQuantity: ministry._count.Scales,
        songKeysQuantity: ministry._count.SongKeys,
      };

      return ministryListItem;
    };

    const ministries = await this.prismaService.ministry.findMany({
      where: {
        ministryID: {
          equals: ministryID,
        },
      },
      include: {
        _count: {
          select: {
            Members: true,
            Scales: true,
            Songs: true,
            SongKeys: true,
          },
        },
      },
    });
    const ministriesListItems: MinistryListItemResponse[] = ministries.map(ministryListItemMapFn);
    return ministriesListItems;
  }

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

  async getSongs(ministryID: number): Promise<SongListItemResponse[]> {
    const songs: SongListItemResponse[] = ([] as any).songs.map((song) => {
      const songListItem: SongListItemResponse = {
        songID: song.songID,
        title: song.title,
        tags: song.tags,
        artistName: song.artist.name,
        hasAudioLink: !!song.audioLink,
        hasChordsLink: !!song.chordsLink,
        hasLyricLink: !!song.lyricLink,
        hasYoutubeLink: !!song.youtubeLink,
        key: song.key,
      };

      return songListItem;
    });

    return songs;
  }

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

  async getAvailableSongs(ministryID: number, ministerID: number): Promise<SongListItemResponse[]> {
    const ministry = {} as any;
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const ministryKeys: MinistryKey[] = ministry.ministryKeys.filter((key) => key.memberID === ministerID);

    const songs: SongListItemResponse[] = ministry.songs
      .filter((song) => !ministryKeys.some((key) => key.songID === song.songID))
      .map((song) => {
        const songListItem: SongListItemResponse = {
          songID: song.songID,
          title: song.title,
          tags: song.tags,
          artistName: song.artist.name,
          hasAudioLink: !!song.audioLink,
          hasChordsLink: !!song.chordsLink,
          hasLyricLink: !!song.lyricLink,
          hasYoutubeLink: !!song.youtubeLink,
          key: song.key,
        };

        return songListItem;
      });

    return songs;
  }

  async getMembers(ministryID: number, roles?: eMinistryRole[]): Promise<MemberListItemResponse[]> {
    const ministry = {} as any;
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    let members: MemberListItemResponse[] = ministry.members.map((member) => {
      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: member.user.name,
        imageUrl: member.user.imageUrl,
        roles: member.roles,
      };

      return memberListItem;
    });

    if (roles) {
      members = members.filter((member) => member.roles.some((role) => roles.includes(role.roleID)));
    }

    return members;
  }

  async getKeyListItems(ministryID: number): Promise<MinistryKeyListItemResponse[]> {
    const ministry = {} as any;
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const keys: MinistryKeyListItemResponse[] = ministry.ministryKeys.map((ministryKey) => {
      const songs = ministry.songs.filter((song) => song.songID === ministryKey.songID);

      if (songs.length > 1) throw new MultipleSongsFoundError(ministryKey.songID);

      const [song] = songs;

      const ministryKeyLabel = KEYS.find((key) => key.keyID === ministryKey.keyID).key;

      const member = ministry.members.find((member) => member.memberID === ministryKey.memberID);

      const keyListItem: MinistryKeyListItemResponse = {
        ministryKeyID: ministryKey.ministryKeyID,
        memberName: member.user.name,
        songTitle: song.title,
        artistName: song.artist.name,
        memberImageUrl: member.user.imageUrl,
        songKey: ministryKeyLabel,
      };

      return keyListItem;
    });

    return keys;
  }

  // async getScaleDetails(scaleID: number): Promise<ScaleDetailResponse> {
  //   const ministry = await this.getMinistryByScaleID(scaleID);
  //   const scale: Scale = ministry.scales.find((scale) => scale.scaleID === scaleID);

  //   const members: MemberListItemResponse[] = scale.participants.map((participant) => {
  //     const memberListItem: MemberListItemResponse = {
  //       memberID: participant.member.memberID,
  //       name: participant.member.user.name,
  //       imageUrl: participant.member.user.imageUrl,
  //       roles: participant.member.roles,
  //     };

  //     return memberListItem;
  //   });

  //   const minister = this.findMinister(scale);

  //   const songs: SongListItemResponse[] = scale.songs.map((song) => {
  //     const ministryKey = this.getMinistryKeyName(ministry, song, minister);

  //     const songListItem: SongListItemResponse = {
  //       songID: song.songID,
  //       title: song.title,
  //       artistName: song.artist.name,
  //       tags: song.tags,
  //       hasAudioLink: !!song.audioLink,
  //       hasChordsLink: !!song.chordsLink,
  //       hasLyricLink: !!song.lyricLink,
  //       hasYoutubeLink: !!song.youtubeLink,
  //       key: ministryKey,
  //     };

  //     return songListItem;
  //   });

  //   const scaleDetail: ScaleDetailResponse = {
  //     scaleID: scaleID,
  //     title: scale.title,
  //     date: scale.date,
  //     participants: members,
  //     songs: songs,
  //   };

  //   return scaleDetail;
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

  private getMinistryKeyName(ministry: Ministry, song: Song, minister: Member): string {
    if (!minister) return null;

    const ministryKey = ministry.ministryKeys.find((ministryKey) => {
      const hasMinistryKey =
        ministryKey.songID === song.songID &&
        ministryKey.memberID === minister.memberID &&
        ministryKey.ministryID === ministry.ministryID;

      return hasMinistryKey;
    });

    if (!ministryKey) return `Não possui tom cadastrado para o ministro(a) ${minister.user.name}`;

    const keyName = KEYS.find((key) => key.keyID === ministryKey.keyID).key;
    return keyName;
  }

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
