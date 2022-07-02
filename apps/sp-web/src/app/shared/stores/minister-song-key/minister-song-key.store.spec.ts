import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IMinisterSongKeyListItemResponse } from '@sp/shared-interfaces';
import { MinistryApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry';
import { NgSimpleStateModule } from 'ng-simple-state';
import { of } from 'rxjs';
import { anyNumber, instance, mock, verify, when } from 'ts-mockito';
import { MINISTER_SONG_KEY_INITIAL_STATE, MinisterSongKeyStore } from './minister-song-key.store';

function setup(ministryApiService: MinistryApiService, toastService: HotToastService, ministryStore: MinistryStore) {
  const injector = TestBed.inject(Injector);
  const ministerSongKeyStore = new MinisterSongKeyStore(injector, ministryApiService, toastService, ministryStore);

  return { store: ministerSongKeyStore };
}

describe('[Store] => MinisterSongKeyStore', () => {
  const mockSongApiService = mock(MinistryApiService);
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
    const { store } = setup(mockSongApiService, mockHotToastService, mockMinistryStore);

    expect(store.getCurrentState()).toEqual(MINISTER_SONG_KEY_INITIAL_STATE);
    expect(store.getCurrentState()).not.toBeNull();
  });

  it('should retrieve all minister song keys', () => {
    const ministerSongKeys: IMinisterSongKeyListItemResponse[] = [
      {
        artistName: 'Artist 1',
        songKey: 'C',
        memberID: 1,
        memberImageUrl: '',
        memberName: 'Member 1',
        songID: 1,
        songTitle: 'Song 1',
      },
    ];

    when(mockSongApiService.getMinisterSongKeys(anyNumber())).thenReturn(of(ministerSongKeys));
    const songApiServiceInstance = instance(mockSongApiService);

    const { store } = setup(songApiServiceInstance, mockHotToastService, mockMinistryStore);
    const SOME_MINISTRY_ID = 1;

    store.findAll(SOME_MINISTRY_ID).subscribe((songsRetrieved) => {
      expect(songsRetrieved).toEqual(ministerSongKeys);
    });

    expect(store.getCurrentState()).toEqual({
      ...MINISTER_SONG_KEY_INITIAL_STATE,
      ministerSongKeys,
    });

    verify(mockSongApiService.getMinisterSongKeys(SOME_MINISTRY_ID)).once();
  });
});
