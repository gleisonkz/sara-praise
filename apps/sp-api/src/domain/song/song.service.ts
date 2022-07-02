import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import { AvailableSongResponse, SongListItemResponse } from '@sp/shared-interfaces';

import { SongRequestDto } from 'apps/sp-api/src/domain/song/dto/song.dto';

@Injectable()
export class SongService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(ministryID: number, songRequestDto: SongRequestDto): Promise<SongListItemResponse> {
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
      include: {
        artist: true,
        key: true,
      },
    });

    const songResponse: SongListItemResponse = {
      songID: song.songID,
      title: song.title,
      artistName: song.artist.name,
      hasAudioLink: !!song.audioUrl,
      hasChordsLink: !!song.chordsUrl,
      hasLyricLink: !!song.lyricUrl,
      hasYoutubeLink: !!song.youtubeUrl,
      key: song.key.notation,
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
        key: song.key.notation,
        tags: song.tags,
      };

      return songListItemResponse;
    });

    return songListItemResponses;
  }

  async getAvailableSongs(ministryID: number, ministerID: number, songID?: number): Promise<AvailableSongResponse[]> {
    const songsPredicate = songID ? { songID } : {};

    const songs = await this.prismaService.song.findMany({
      where: {
        ministryID,
        ...songsPredicate,
        AND: {
          ministerSongKeys: {
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
  }
}
