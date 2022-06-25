import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SongListItemResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { SongApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/song.api.service';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry';
import { NgSimpleStateModule } from 'ng-simple-state';
import { of } from 'rxjs';
import { anyNumber, instance, mock, verify, when } from 'ts-mockito';
import { SONG_INITIAL_STATE, SongStore } from './song.store';

function setup(songApiService: SongApiService, toastService: HotToastService, ministryStore: MinistryStore) {
  const injector = TestBed.inject(Injector);
  const songStore = new SongStore(injector, songApiService, toastService, ministryStore);

  return { store: songStore };
}

describe('[Store] => SongStore', () => {
  const mockSongApiService = mock(SongApiService);
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

    expect(store.getCurrentState()).toEqual(SONG_INITIAL_STATE);
    expect(store.getCurrentState()).not.toBeNull();
  });

  it('should retrieve all songs', () => {
    const songs: SongListItemResponse[] = [
      {
        artistName: 'Eli Soa,res',
        hasAudioLink: false,
        hasChordsLink: false,
        hasLyricLink: false,
        hasYoutubeLink: false,
        key: 'Gb',
        songID: 9,
        tags: ['Júbilo'],
        title: 'Deus cuida de mim',
      },
    ];

    when(mockSongApiService.findAll(anyNumber())).thenReturn(of(songs));
    const songApiServiceInstance = instance(mockSongApiService);

    const { store } = setup(songApiServiceInstance, mockHotToastService, mockMinistryStore);
    const SOME_MINISTRY_ID = 1;

    store.findAll(SOME_MINISTRY_ID).subscribe((songsRetrieved) => {
      expect(songsRetrieved).toEqual(songs);
    });

    expect(store.getCurrentState()).toEqual({
      ...SONG_INITIAL_STATE,
      songs,
    });

    verify(mockSongApiService.findAll(SOME_MINISTRY_ID)).once();
  });
});
