import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import { AvailableSongResponse, SongListItemResponse } from '@sp/shared-interfaces';

import { SongRequestDto, SongResponseDto } from 'apps/sp-api/src/domain/song/dto/song.dto';

@Injectable()
export class SongService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(ministryID: number, songRequestDto: SongRequestDto): Promise<SongResponseDto> {
    const song = await this.prismaService.song.create({
      data: {
        title: songRequestDto.title,
        artistID: songRequestDto.artistID,
        ministryID,
        audioUrl: songRequestDto.audioUrl,
        chordsUrl: songRequestDto.chordsUrl,
        lyricUrl: songRequestDto.lyricUrl,
        youtubeUrl: songRequestDto.youtubeUrl,
        tags: songRequestDto.tags,
        keyID: songRequestDto.keyID,

        observations: songRequestDto.observations,
      },
    });

    const songResponse: SongResponseDto = {
      songID: song.songID,
      title: song.title,
      artistID: song.artistID,
      audioUrl: song.audioUrl,
      chordsUrl: song.chordsUrl,
      lyricUrl: song.lyricUrl,
      youtubeUrl: song.youtubeUrl,
      keyID: song.keyID,
      observations: song.observations,
      tags: song.tags,
    };

    return songResponse;
  }

  async findAll(ministryID: number): Promise<SongListItemResponse[]> {
    const songs = await this.prismaService.song.findMany({
      where: { ministryID },
      include: {
        artist: true,
        key: true,
      },
    });

    const songListItemResponses: SongListItemResponse[] = songs.map((song) => {
      const songListItemResponse: SongListItemResponse = {
        songID: song.songID,
        title: song.title,
        artistName: song.artist.name,
        hasAudioLink: !!song.audioUrl,
        hasChordsLink: !!song.chordsUrl,
        hasLyricLink: !!song.lyricUrl,
        hasYoutubeLink: !!song.youtubeUrl,
        key: song.key.name,
        tags: song.tags,
      };

      return songListItemResponse;
    });

    return songListItemResponses;
  }

  async getAvailableSongs(ministryID: number, ministerID: number): Promise<AvailableSongResponse[]> {
    const songs = await this.prismaService.song.findMany({
      where: {
        ministryID,
        AND: {
          ministerSongKey: {
            none: {
              memberID: ministerID,
            },
          },
        },
      },
      include: {
        artist: {
          select: { name: true },
        },
      },
    });

    const availableSongs: AvailableSongResponse[] = songs.map((song) => {
      const availableSong: AvailableSongResponse = {
        songID: song.songID,
        title: song.title,
        artistName: song.artist.name,
      };

      return availableSong;
    });

    return availableSongs;

    // const ministryKeys: MinistryKey[] = ministry.ministryKeys.filter((key) => key.memberID === ministerID);

    // const songs: SongListItemResponse[] = ministry.songs
    //   .filter((song) => !ministryKeys.some((key) => key.songID === song.songID))
    //   .map((song) => {
    //     const songListItem: SongListItemResponse = {
    //       songID: song.songID,
    //       title: song.title,
    //       tags: song.tags,
    //       artistName: song.artist.name,
    //       hasAudioLink: !!song.audioLink,
    //       hasChordsLink: !!song.chordsLink,
    //       hasLyricLink: !!song.lyricLink,
    //       hasYoutubeLink: !!song.youtubeLink,
    //       key: song.key,
    //     };

    //     return songListItem;
    //   });

    // return songs;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} song`;
  // }

  // update(id: number, updateSongDto: UpdateSongDto) {
  //   return `This action updates a #${id} song`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} song`;
  // }
}
