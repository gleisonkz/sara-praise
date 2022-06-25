import { Injectable, Injector } from '@angular/core';

import { SongListItemResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { SongApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/song.api.service';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { Observable, switchMap, tap } from 'rxjs';

export interface SongState {
  songs: SongListItemResponse[];
}

export const SONG_INITIAL_STATE: SongState = {
  songs: [],
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

  findAll(ministryID: number): Observable<SongListItemResponse[]> {
    return this.songApiService.findAll(+ministryID).pipe(
      tap((songs) => {
        this.setState((state) => ({ ...state, songs }));
      }),
      switchMap(() => this.selectState((state) => state.songs))
    );
  }
}
