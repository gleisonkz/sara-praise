import { Injectable } from '@nestjs/common';

import { eMinistryRole } from '@sp/api/enums';
import { Member, Ministry, Scale, Song } from '@sp/api/models';
import {
    KeyListItemResponse, MemberListItemResponse, MinistryListItemResponse, MinistryRequest,
    ScaleDetailResponse, ScaleListItemResponse, SongListItemResponse
} from '@sp/shared-interfaces';

import { MINISTRIES_MOCK } from '../mocks';

export class MinistryNotFoundError extends Error {
  constructor(public ministryID: number) {
    super(`Ministry with ID ${ministryID} not found`);
  }
}

@Injectable()
export class MinistryService {
  private ministries: Ministry[] = MINISTRIES_MOCK;

  getMinistriesListItems(ministryID?: string): MinistryListItemResponse[] {
    const ministryPredicate = (ministry: Ministry) => ministry.ministryID === Number(ministryID);

    const filteredMinistries: Ministry[] = ministryID ? this.ministries.filter(ministryPredicate) : this.ministries;

    const ministriesListItems: MinistryListItemResponse[] = filteredMinistries.map((ministry) => {
      const ministryListItem: MinistryListItemResponse = {
        ministryID: ministry.ministryID,
        name: ministry.name,
      };

      return ministryListItem;
    });

    return ministriesListItems;
  }

  async getScales(ministryID: number) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const imageUrlMapFn = (scale: Scale) => scale.members.map((member) => member.user.imageUrl);

    const scales: ScaleListItemResponse[] = ministry.scales.map((scale) => {
      const scaleListItem: ScaleListItemResponse = {
        scaleID: scale.scaleID,
        title: scale.title,
        date: scale.date,
        imagesUrl: imageUrlMapFn(scale),
        notes: scale.notes,
        songsQuantity: scale.songs.length,
      };

      return scaleListItem;
    });

    return scales;
  }

  async getSongs(ministryID: number) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const songs: SongListItemResponse[] = ministry.songs.map((song) => {
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

  async getMembers(ministryID: number) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const members: MemberListItemResponse[] = ministry.members.map((member) => {
      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: member.user.name,
        imageUrl: member.user.imageUrl,
        roles: member.roles,
      };

      return memberListItem;
    });

    return members;
  }

  async getKeys(ministryID: number) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const keys: KeyListItemResponse[] = ministry.keys.map((key) => {
      const song = ministry.songs.find((song) => song.songID === key.songID);
      const member = ministry.members.find((member) => member.memberID === key.memberID);

      const keyListItem: KeyListItemResponse = {
        keyID: key.keyID,
        memberName: member.user.name,
        songTitle: song.title,
        artistName: song.artist.name,
        memberImageUrl: member.user.imageUrl,
        songKey: song.key,
      };

      return keyListItem;
    });

    return keys;
  }

  createMinistry(ministryListItem: MinistryRequest): MinistryListItemResponse {
    const ministry: Ministry = {
      ministryID: this.ministries.length + 1,
      name: ministryListItem.name,
      ownerId: ministryListItem.ownerID,
      members: [],
      roles: [],
      scales: [],
      songs: [],
      keys: [],
      ministryKeys: [],
    };

    const ministryListItemResponse: MinistryListItemResponse = {
      ministryID: ministry.ministryID,
      name: ministry.name,
    };

    this.ministries.push(ministry);
    return ministryListItemResponse;
  }

  getScaleDetails(scaleID: number) {
    const ministry = this.ministries.find((ministry) => ministry.scales.find((scale) => scale.scaleID === scaleID));
    if (!ministry) throw new MinistryNotFoundError(scaleID);

    const scale = ministry.scales.find((scale) => scale.scaleID === scaleID);

    const members: MemberListItemResponse[] = scale.members.map((member) => {
      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: member.user.name,
        imageUrl: member.user.imageUrl,
        roles: member.roles,
      };

      return memberListItem;
    });

    const minister = scale.members.find((member) => member.roles.includes(eMinistryRole.MINISTER));

    const songs: SongListItemResponse[] = scale.songs.map((song) => {
      const ministryKey = this.getMinistryKey(ministry, song, minister);

      const songListItem: SongListItemResponse = {
        songID: song.songID,
        title: song.title,
        artistName: song.artist.name,
        tags: song.tags,
        hasAudioLink: !!song.audioLink,
        hasChordsLink: !!song.chordsLink,
        hasLyricLink: !!song.lyricLink,
        hasYoutubeLink: !!song.youtubeLink,
        key: ministryKey,
      };

      return songListItem;
    });

    const scaleDetail: ScaleDetailResponse = {
      scaleID: scaleID,
      date: scale.date,
      participants: members,
      songs: songs,
    };

    return scaleDetail;
  }

  private getMinistryKey(ministry: Ministry, song: Song, minister: Member) {
    if (!minister) return null;

    const ministryKey = ministry.ministryKeys.find((ministryKey) => {
      const hasMinistryKey =
        ministryKey.songID === song.songID &&
        ministryKey.memberID === minister.memberID &&
        ministryKey.ministryID === ministry.ministryID;

      return hasMinistryKey;
    });

    if (!ministryKey) return `Não possui tom cadastrado para o ministro(a) ${minister.name}`;

    const key = ministry.keys.find((key) => ministryKey.keyID === key.keyID);
    const ministerSongKey = key.keyLabel;

    return ministerSongKey;
  }
}
