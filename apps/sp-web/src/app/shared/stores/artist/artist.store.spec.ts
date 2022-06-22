import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';
import { ArtistApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import {
    ARTIST_INITIAL_STATE, ArtistState
} from 'apps/sp-web/src/app/shared/stores/artist/artist.store';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { NgSimpleStateModule } from 'ng-simple-state';
import { EMPTY, of } from 'rxjs';
import { anyNumber, instance, mock, verify, when } from 'ts-mockito';
import { ArtistStore } from './artist.store';

function setup(artistApiService: ArtistApiService, toastService: HotToastService, ministryStore: MinistryStore) {
  const injector = TestBed.inject(Injector);
  const artistStore = new ArtistStore(injector, artistApiService, toastService, ministryStore);

  return { store: artistStore };
}

describe('[Store] => Artist', () => {
  const mockArtistApiService = mock(ArtistApiService);
  const mockHotToastService = mock(HotToastService);
  const mockMinistryStore = mock(MinistryStore);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgSimpleStateModule.forRoot({
          enableDevTool: false,
          enableLocalStorage: false,
        }),
      ],
    });
  });

  it('should successfully get initial state', () => {
    const { store } = setup(mockArtistApiService, mockHotToastService, mockMinistryStore);

    expect(store.getCurrentState()).toEqual(ARTIST_INITIAL_STATE);
    expect(store.getCurrentState()).not.toBeNull();
  });

  it('should retrieve all artists', () => {
    const artists: ArtistResponse[] = [
      {
        artistID: 38,
        name: 'Teste',
      },
      {
        artistID: 39,
        name: 'Teste 2',
      },
    ];

    when(mockArtistApiService.findAll(anyNumber())).thenReturn(of(artists));
    const artistApiServiceInstance = instance(mockArtistApiService);

    const { store } = setup(artistApiServiceInstance, mockHotToastService, mockMinistryStore);

    const SOME_MINISTRY_ID = 1;

    store.findAll(SOME_MINISTRY_ID).subscribe((artistsRetrieved) => {
      expect(artistsRetrieved).toEqual(artists);
    });

    expect(store.getCurrentState()).toEqual({
      ...ARTIST_INITIAL_STATE,
      artists,
    });

    verify(mockArtistApiService.findAll(SOME_MINISTRY_ID)).once();
  });

  it('should retrieve a artist by ID', () => {
    const artist: ArtistResponse = {
      artistID: 38,
      name: 'Teste',
    };

    const SOME_ARTIST_ID = 38;

    when(mockArtistApiService.findByID(SOME_ARTIST_ID)).thenReturn(of(artist));
    const artistApiServiceInstance = instance(mockArtistApiService);

    const { store } = setup(artistApiServiceInstance, mockHotToastService, mockMinistryStore);

    store.findByID(SOME_ARTIST_ID).subscribe((artistRetrieved) => {
      expect(artistRetrieved).toEqual(artist);
    });

    expect(store.getCurrentState()).toEqual(ARTIST_INITIAL_STATE);
    verify(mockArtistApiService.findByID(SOME_ARTIST_ID)).once();
  });

  it('should create a artist', () => {
    const mockedArtistResponse: ArtistResponse = {
      artistID: 38,
      name: 'Teste',
    };

    const artistRequest: ArtistRequest = {
      name: 'Some Name',
    };

    const SOME_MINISTRY_ID = 1;

    when(mockArtistApiService.create(SOME_MINISTRY_ID, artistRequest)).thenReturn(of(mockedArtistResponse));
    const artistApiServiceInstance = instance(mockArtistApiService);

    const { store } = setup(artistApiServiceInstance, mockHotToastService, mockMinistryStore);

    store.create(SOME_MINISTRY_ID, artistRequest).subscribe((artistRetrieved) => {
      expect(artistRetrieved).toEqual(mockedArtistResponse);

      const expectedState: ArtistState = {
        artists: [mockedArtistResponse],
      };

      expect(store.getCurrentState()).toEqual(expectedState);
      verify(mockArtistApiService.create(SOME_MINISTRY_ID, artistRequest)).once();
      verify(mockMinistryStore.incrementArtistsQuantity).once();
    });
  });

  it('should delete a artist from the store', () => {
    const targetArtist: ArtistResponse = {
      artistID: 38,
      name: 'Teste',
    };

    const mockedArtists: ArtistResponse[] = [targetArtist];
    const SOME_MINISTRY_ID = 1;

    when(mockArtistApiService.findAll(SOME_MINISTRY_ID)).thenReturn(of(mockedArtists));
    when(mockArtistApiService.remove(SOME_MINISTRY_ID, targetArtist.artistID)).thenReturn(EMPTY);

    const artistApiServiceInstance = instance(mockArtistApiService);
    const { store } = setup(artistApiServiceInstance, mockHotToastService, mockMinistryStore);

    store.findAll(SOME_MINISTRY_ID).subscribe((artistsRetrieved) => {
      expect(artistsRetrieved).toEqual(mockedArtists);
    });

    const expectedState: ArtistState = {
      artists: [],
    };

    store.remove(SOME_MINISTRY_ID, targetArtist.artistID).subscribe(() => {
      expect(store.getCurrentState().artists).toEqual(expectedState);

      verify(mockArtistApiService.findAll(SOME_MINISTRY_ID)).once();
      verify(mockArtistApiService.remove(SOME_MINISTRY_ID, targetArtist.artistID)).once();
      verify(mockMinistryStore.decrementArtistsQuantity()).once();
    });
  });
});
