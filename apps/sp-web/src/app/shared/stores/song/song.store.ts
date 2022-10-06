import { Injectable, Injector } from '@angular/core';

import { Pagination, SongListItemResponse, SongRequest, SongResponse } from '@sp/shared-interfaces';
import { MinistryStore } from '@sp/web/shared/stores';

import { HotToastService } from '@ngneat/hot-toast';
import { SongApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/song.api.service';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { filter, Observable, switchMap, tap } from 'rxjs';

export interface SongState {
  songs: Pagination<SongListItemResponse>;
  songResponse?: SongResponse;
}

export const SONG_INITIAL_STATE: SongState = {
  songs: {
    currentPage: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
    totalItems: 0,
    totalPages: 0,
    data: [],
  },
  songResponse: undefined,
};

@Injectable()
export class SongStore extends NgSimpleStateBaseStore<SongState> {
  constructor(
    injector: Injector,
    private readonly songApiService: SongApiService,
    private readonly toastService: HotToastService,
    private readonly ministryStore: MinistryStore
  ) {
    super(injector);
  }

  initialState(): SongState {
    return SONG_INITIAL_STATE;
  }

  findAll(ministryID: number, pageSize: number, pageNumber: number): Observable<Pagination<SongListItemResponse>> {
    return this.songApiService.findAll(+ministryID, pageSize, pageNumber).pipe(
      tap((songs) => {
        this.setState((state) => ({ ...state, songs }));
      }),
      switchMap(() => this.selectState((state) => state.songs))
    );
  }

  findByID(ministryID: number, songID: number): Observable<SongResponse> {
    return this.songApiService.findByID(+ministryID, +songID).pipe(
      tap((song) => {
        this.setState((state) => ({ ...state, songResponse: song }));
      }),
      switchMap(() => this.selectState((state) => state.songResponse)),
      filter(Boolean)
    );
  }

  create(ministryID: number, song: SongRequest): Observable<SongListItemResponse> {
    return this.songApiService.create(+ministryID, song).pipe(
      tap((createdSong) => {
        this.setState((state) => ({ ...state, songs: { ...state.songs, data: [...state.songs.data, createdSong] } }));
        this.ministryStore.incrementSongsQuantity();
        this.toastService.success('Música criada com sucesso!');
      })
    );
  }

  delete(ministryID: number, songID: number): Observable<void> {
    return this.songApiService.delete(+ministryID, +songID).pipe(
      tap(() => {
        this.setState((state) => ({
          ...state,
          songs: {
            ...state.songs,
            data: state.songs.data.filter((song) => song.songID !== songID),
          },
        }));
        this.ministryStore.decrementSongsQuantity();
        this.toastService.success('Música excluída com sucesso!');
      })
    );
  }

  update(ministryID: number, songID: number, song: SongRequest): Observable<SongListItemResponse> {
    return this.songApiService.update(+ministryID, +songID, song).pipe(
      tap((updatedSong) => {
        this.setState((state) => ({
          ...state,
          songs: {
            ...state.songs,
            data: state.songs.data.map((song) => (song.songID === updatedSong.songID ? updatedSong : song)),
          },
        }));
        this.toastService.success('Música atualizada com sucesso!');
      })
    );
  }
}
