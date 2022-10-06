import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import {
    AvailableSongResponse, Pagination, SongListItemResponse, SongResponse
} from '@sp/shared-interfaces';

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

  async findAll(ministryID: number, pageSize: number, pageNumber: number): Promise<any> {
    console.log('pageSize', pageSize);
    console.log('pageNumber', pageNumber);
    console.log('ministryID', ministryID);

    const [ministry] = await this.prismaService.ministry.findMany({
      where: { ministryID },
      include: {
        songs: {
          ...(pageSize &&
            pageNumber && {
              skip: pageSize * (pageNumber - 1),
              take: pageSize,
            }),
          include: {
            artist: true,
            key: true,
          },
        },
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });

    const { songs, _count } = ministry;

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

    const result: Pagination<SongListItemResponse> = {
      hasNextPage: pageSize * pageNumber < _count.songs,
      hasPreviousPage: pageNumber > 1,
      currentPage: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(_count.songs / pageSize),
      totalItems: _count.songs,
      data: songListItemResponses,
    };

    return result;
  }

  async findOne(ministryID: number, songID: number): Promise<SongResponse> {
    const song = await this.prismaService.song.findUnique({
      where: { songID },
      include: {
        artist: true,
        key: true,
      },
    });

    const songResponse: SongResponse = {
      songID: song.songID,
      title: song.title,
      artistID: song.artistID,
      audioUrl: song.audioUrl,
      chordsUrl: song.chordsUrl,
      lyricUrl: song.lyricUrl,
      youtubeUrl: song.youtubeUrl,
      keyID: song.keyID,
      tags: song.tags,
      observations: song.observations,
    };

    return songResponse;
  }

  async update(ministryID: number, songID: number, songRequestDto: SongRequestDto): Promise<SongListItemResponse> {
    const song = await this.prismaService.song.update({
      where: { songID },
      data: {
        title: songRequestDto.title,
        artistID: songRequestDto.artistID,
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
