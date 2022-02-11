import { Injectable } from '@nestjs/common';

import { Member, Ministry, Role, Scale, Song } from '@sp/api/models';
import {
    eMinistryRole, KeyResponse, MemberListItemResponse, MinistryKeyListItemResponse,
    MinistryKeyRequest, MinistryListItemResponse, MinistryRequest, ScaleDetailResponse,
    ScaleListItemResponse, ScaleRequest, ScaleResponse, SongListItemResponse
} from '@sp/shared-interfaces';

import { MinistryKey } from 'apps/sp-api/src/app/models/ministry-key.model';
import { MinistryRepository } from '../database/ministry-repository';
import { KEYS } from '../mocks/keys.mock';

export class MinistryNotFoundError extends Error {
  constructor(public ministryID: number) {
    super(`Ministry with ID ${ministryID} not found`);
  }
}

export class MinistryByScaleNotFoundError extends Error {
  constructor(public scaleID: number) {
    super(`Not found any ministry associated with scale with ID ${scaleID}`);
  }
}

export class MultipleSongsFoundError extends Error {
  constructor(public songID: number) {
    super(`Multiple songs with ID ${songID} found`);
  }
}

export class ScaleNotFoundError extends Error {
  constructor(public ministryID: number, public scaleID: number) {
    super(`Scale with ID ${scaleID} not found for ministry with ID ${ministryID}`);
  }
}

const sixteenHours = new Date(0);
sixteenHours.setHours(16);

function combineDateAndTime(dateFrom: string, timeFrom: string): Date {
  const time = new Date(dateFrom);
  const date = new Date(timeFrom);

  const mins = time.getMinutes().toString().padStart(2, '0');
  const hours = time.getHours().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${mins}:${seconds}`;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;

  const dateAndTime = `${dateString}T${timeString}`;
  return new Date(dateAndTime);
}

function splitDateAndTime(dateString: string): { date: Date; time: Date } {
  const dateAndTime = new Date(dateString);

  const mins = dateAndTime.getMinutes();
  const hours = dateAndTime.getHours();
  const seconds = dateAndTime.getSeconds();

  const time = new Date();
  time.setHours(hours);
  time.setMinutes(mins);
  time.setSeconds(seconds);

  const year = dateAndTime.getFullYear();
  const month = dateAndTime.getMonth();
  const day = dateAndTime.getDate();

  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month);
  date.setDate(day);

  return { date, time };
}

@Injectable()
export class MinistryService {
  private storage = this.ministryRepository.getDataBase();
  private ministries: Ministry[] = this.storage.ministriesMock;

  constructor(private ministryRepository: MinistryRepository) {}

  async createScale(ministryID: number, scaleRequest: ScaleRequest) {
    const ministry = this.getMinistryByID(ministryID);

    const nextScaleID = ministry.scales.length + 1;
    const date = combineDateAndTime(scaleRequest.date, scaleRequest.time);

    const scale: Scale = {
      scaleID: nextScaleID,
      title: scaleRequest.title,
      date,
      notes: scaleRequest.notes,
      songs: [],
      members: [],
    };

    ministry.scales.push(scale);
    this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');

    return nextScaleID;
  }

  async getScaleByIDAsync(scaleID: number): Promise<ScaleResponse> {
    let ministryID: number;

    const ministry = this.getMinistryByScaleID(scaleID);
    const scale: Scale = ministry.scales.find((scale) => scale.scaleID === scaleID);

    if (!scale) throw new ScaleNotFoundError(ministryID, scaleID);

    const { date, time } = splitDateAndTime(scale.date.toISOString());

    const scaleDetail: ScaleResponse = {
      scaleID: scale.scaleID,
      title: scale.title,
      date: date.toISOString().split('T')[0],
      time: time.toISOString().split('T')[1],
      notes: scale.notes,
    };

    return scaleDetail;
  }

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

    this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');

    return ministryKeyListItem;
  }

  getMinistriesListItems(ministryID?: string): MinistryListItemResponse[] {
    const ministryPredicate = (ministry: Ministry) => ministry.ministryID === Number(ministryID);

    const filteredMinistries: Ministry[] = ministryID ? this.ministries.filter(ministryPredicate) : this.ministries;

    const ministriesListItems: MinistryListItemResponse[] = filteredMinistries.map((ministry) => {
      const ministryListItem: MinistryListItemResponse = {
        ministryID: ministry.ministryID,
        name: ministry.name,
        musicsQuantity: ministry.songs.length,
        membersQuantity: ministry.members.length,
        scalesQuantity: ministry.scales.length,
        keysQuantity: ministry.ministryKeys.length,
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

  async getAvailableSongs(ministryID: number, ministerID: number): Promise<SongListItemResponse[]> {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
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

  async getMembers(ministryID: number, roles?: eMinistryRole[]) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
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

  async getKeyListItems(ministryID: number) {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);
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

  getKeys(): KeyResponse[] {
    return KEYS;
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
      ministryKeys: [],
    };

    const ministryListItemResponse: MinistryListItemResponse = {
      ministryID: ministry.ministryID,
      name: ministry.name,
      musicsQuantity: ministry.songs.length,
      membersQuantity: ministry.members.length,
      scalesQuantity: ministry.scales.length,
      keysQuantity: ministry.ministryKeys.length,
    };

    this.ministries.push(ministry);

    this.ministryRepository.saveDataBase(this.ministries, 'ministriesMock');
    return ministryListItemResponse;
  }

  getScaleDetails(scaleID: number) {
    const ministry = this.getMinistryByScaleID(scaleID);
    const scale: Scale = ministry.scales.find((scale) => scale.scaleID === scaleID);

    const members: MemberListItemResponse[] = scale.members.map((member) => {
      const memberListItem: MemberListItemResponse = {
        memberID: member.memberID,
        name: member.user.name,
        imageUrl: member.user.imageUrl,
        roles: member.roles,
      };

      return memberListItem;
    });

    const minister = this.findMinister(scale);

    const songs: SongListItemResponse[] = scale.songs.map((song) => {
      const ministryKey = this.getMinistryKeyName(ministry, song, minister);

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
      title: scale.title,
      date: scale.date,
      participants: members,
      songs: songs,
    };

    return scaleDetail;
  }

  private findMinister(scale: Scale) {
    const isMinisterPredicate = ({ roleID }: Role) => roleID === eMinistryRole.MINISTER;

    const minister: Member = scale.members.find((member) => {
      const isMinister = member.roles.some(isMinisterPredicate);
      return isMinister;
    });

    return minister;
  }

  private getMinistryKeyName(ministry: Ministry, song: Song, minister: Member) {
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
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);

    if (!ministry) throw new MinistryNotFoundError(ministryID);
    return ministry;
  }

  private getMinistryByScaleID(scaleID: number): Ministry {
    const ministry = this.ministryRepository.getDataBase().ministriesMock.find((ministry) => {
      const scale = ministry.scales.find((scale) => scale.scaleID === scaleID);
      if (!scale) throw new ScaleNotFoundError(ministry.ministryID, scaleID);

      return true;
    });

    if (!ministry) throw new MinistryByScaleNotFoundError(scaleID);
    return ministry;
  }
}
