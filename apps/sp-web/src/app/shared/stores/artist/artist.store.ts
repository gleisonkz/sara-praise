import { Injectable, Injector } from '@angular/core';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';
import { ArtistApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { Observable, switchMap, tap } from 'rxjs';

export interface ArtistState {
  artists: ArtistResponse[];
}

export const ARTIST_INITIAL_STATE: ArtistState = {
  artists: [],
};

@Injectable()
export class ArtistStore extends NgSimpleStateBaseStore<ArtistState> {
  constructor(
    injector: Injector,
    private readonly artistApiService: ArtistApiService,
    private readonly toastService: HotToastService,
    private readonly ministryStore: MinistryStore
  ) {
    super(injector);
  }

  initialState(): ArtistState {
    return ARTIST_INITIAL_STATE;
  }

  create(ministryID: number, artistRequest: ArtistRequest): Observable<ArtistResponse> {
    return this.artistApiService.create(ministryID, artistRequest).pipe(
      tap((artist) => {
        this.setState((state) => ({ ...state, artists: [...state.artists, artist] }));

        this.ministryStore.incrementArtistsQuantity();
        this.toastService.success('Artista criado com sucesso!');
      })
    );
  }

  update(ministryID: number, artistID: number, artistRequest: ArtistRequest) {
    return this.artistApiService.update(ministryID, artistID, artistRequest).pipe(
      tap((artist) => {
        this.setState((state) => {
          const targetArtistIndex = state.artists.findIndex((item) => item.artistID === artistID);
          const artists = [...state.artists];
          artists[targetArtistIndex] = artist;
          return { ...state, artists };
        });
        this.toastService.success('Artista atualizado com sucesso!');
      })
    );
  }

  remove(ministryID: number, artistID: number) {
    return this.artistApiService.remove(ministryID, artistID).pipe(
      tap(() => {
        this.setState((state) => ({
          artists: state.artists.filter((artist) => artist.artistID !== artistID),
        }));

        this.ministryStore.decrementArtistsQuantity();
        this.toastService.success('Artista removido com sucesso!');
      })
    );
  }

  findAll(ministryID: number): Observable<ArtistResponse[]> {
    return this.artistApiService.findAll(+ministryID).pipe(
      tap((artists) => {
        this.setState((state) => ({ ...state, artists }));
      }),
      switchMap(() => this.selectState((state) => state.artists))
    );
  }

  findByID(artistID: number): Observable<ArtistResponse> {
    return this.artistApiService.findByID(artistID);
  }
}
