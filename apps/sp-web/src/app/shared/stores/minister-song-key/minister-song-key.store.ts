import { Injectable, Injector } from '@angular/core';

import { IMinisterSongKeyListItemResponse, IMinisterSongKeyRequest } from '@sp/shared-interfaces';
import { MinistryApiService } from '@sp/web/domain/ministry/services';
import { MinistryStore } from '@sp/web/shared/stores';

import { HotToastService } from '@ngneat/hot-toast';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { Observable, switchMap, tap } from 'rxjs';

export interface MinisterSongKeyState {
  ministerSongKeys: IMinisterSongKeyListItemResponse[];
}

export const MINISTER_SONG_KEY_INITIAL_STATE: MinisterSongKeyState = {
  ministerSongKeys: [],
};

@Injectable()
export class MinisterSongKeyStore extends NgSimpleStateBaseStore<MinisterSongKeyState> {
  constructor(
    injector: Injector,
    private readonly ministryApiService: MinistryApiService,
    private readonly toastService: HotToastService,
    private readonly ministryStore: MinistryStore
  ) {
    super(injector);
  }

  initialState(): MinisterSongKeyState {
    return MINISTER_SONG_KEY_INITIAL_STATE;
  }

  findAll(ministryID: number): Observable<IMinisterSongKeyListItemResponse[]> {
    return this.ministryApiService.getMinisterSongKeys(ministryID).pipe(
      tap((ministerSongKeys) => {
        this.setState((state) => ({ ...state, ministerSongKeys }));
      }),
      switchMap(() => this.selectState((state) => state.ministerSongKeys))
    );
  }

  create(ministryID: number, ministerSongKey: IMinisterSongKeyRequest): Observable<IMinisterSongKeyListItemResponse> {
    return this.ministryApiService.createMinisterSongKey(ministryID, ministerSongKey).pipe(
      tap((createdMinisterSongKey) => {
        this.setState((state) => ({ ...state, ministerSongKeys: [...state.ministerSongKeys, createdMinisterSongKey] }));
        this.ministryStore.incrementMinisterSongKeysQuantity();
        this.toastService.success('Tonalidade criada com sucesso!');
      })
    );
  }

  remove(ministryID: number, songID: number, memberID: number): Observable<void> {
    return this.ministryApiService.removeMinisterSongKey(ministryID, songID, memberID).pipe(
      tap(() => {
        this.setState((state) => {
          const ministerSongKeyToRemove = state.ministerSongKeys.find(
            (ministerSongKey) => ministerSongKey.songID === songID && ministerSongKey.memberID === memberID
          );

          return {
            ...state,
            ministerSongKeys: state.ministerSongKeys.filter(
              (ministerSongKey) => ministerSongKey !== ministerSongKeyToRemove
            ),
          };
        });

        this.ministryStore.decrementMinisterSongKeysQuantity();
        this.toastService.success('Tonalidade removida com sucesso!');
      })
    );
  }
}
