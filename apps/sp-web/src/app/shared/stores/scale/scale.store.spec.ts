import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ScaleDetailResponse, ScaleListItemResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { NgSimpleStateModule } from 'ng-simple-state';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { SCALE_INITIAL_STATE, ScaleStore } from './scale.store';

function setup(scaleApiService: ScaleApiService, toastService: HotToastService, router: Router) {
  const injector = TestBed.inject(Injector);
  const scaleStore = new ScaleStore(injector, scaleApiService, toastService, router);

  return { store: scaleStore };
}

describe('ScaleStore', () => {
  const mockScaleApiService = mock(ScaleApiService);
  const mockHotToastService = mock(HotToastService);
  const mockRouter = mock(Router);

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
    const { store } = setup(mockScaleApiService, mockHotToastService, mockRouter);

    expect(store.getCurrentState()).toEqual(SCALE_INITIAL_STATE);
    expect(store.getCurrentState()).not.toBeNull();
  });

  it('should retrieve all scales', () => {
    const scales: ScaleListItemResponse[] = [
      {
        date: new Date(),
        notes: 'Será realizado a gincana final para decidir qual das equipes será a vencedora.',
        participants: [],
        scaleID: 2,
        songsQuantity: 0,
        title: 'Arena Jovem',
      },
      {
        date: new Date(),
        notes: 'Santa Ceia, culto onde teremos a palavra ministrada pela.',
        participants: [
          {
            imageUrl:
              'https://scontent-gru1-1.xx.fbcdn.net/v/t39.30808-1…EjsuSvvBEpy-EPAhuLCoeoTrVXreXZJzWLT2A&oe=62B3D83B',
          },
          {
            imageUrl:
              'https://scontent-gru1-2.xx.fbcdn.net/v/t1.6435-9/1…SoXEdK4Md1LyBuFNvn6l5E84cBZGsg3qTIJhA&oe=62D3175E',
          },
          { imageUrl: 'https://randomuser.me/api/portraits/men/76.jpg' },
          {
            imageUrl:
              'https://scontent-gru1-1.xx.fbcdn.net/v/t39.30808-1…nG1Ffp2DRr1-YetYU-rsqT75qe9geLycQAT1Q&oe=62B4BDAD',
          },
        ],
        scaleID: 1,
        songsQuantity: 3,
        title: 'Culto da Familia ',
      },
    ];

    const SOME_MINISTRY_ID = 1;

    when(mockScaleApiService.findAll(SOME_MINISTRY_ID)).thenReturn(of(scales));
    const scaleApiServiceInstance = instance(mockScaleApiService);

    const { store } = setup(scaleApiServiceInstance, mockHotToastService, mockRouter);

    store.findAll(SOME_MINISTRY_ID).subscribe((scalesRetrieved) => {
      expect(scalesRetrieved).toEqual(scales);

      expect(store.getCurrentState()).toEqual({
        ...SCALE_INITIAL_STATE,
        scales,
      });

      verify(mockScaleApiService.findAll(SOME_MINISTRY_ID)).once();
    });
  });

  it('should retrieve a scale by ID', () => {
    const scale: ScaleListItemResponse = {
      date: new Date(),
      notes: 'Será realizado a gincana final para decidir qual das equipes será a vencedora.',
      participants: [],
      scaleID: 2,
      songsQuantity: 0,
      title: 'Arena Jovem',
    };

    const scaleDetails: ScaleDetailResponse = {
      date: new Date(),
      notes: 'Será realizado a gincana final para decidir qual das equipes será a vencedora.',
      participants: [],
      scaleID: 2,
      songs: [],
      title: 'Arena Jovem',
    };

    const SOME_SCALE_ID = 1;
    const SOME_MINISTRY_ID = 1;

    when(mockScaleApiService.findAll(SOME_MINISTRY_ID)).thenReturn(of([scale]));
    when(mockScaleApiService.getScaleListItemDetails(SOME_MINISTRY_ID, SOME_SCALE_ID)).thenReturn(of(scaleDetails));

    const scaleApiServiceInstance = instance(mockScaleApiService);

    const { store } = setup(scaleApiServiceInstance, mockHotToastService, mockRouter);

    store.selectScaleDetail(SOME_MINISTRY_ID, SOME_SCALE_ID).subscribe((scaleRetrieved) => {
      expect(scaleRetrieved).toEqual(scale);
    });

    expect(1).toEqual([]);
    verify(mockScaleApiService.findAll(SOME_SCALE_ID)).once();
  });

  // it('should set current scale by ID', () => {
  //   const expectedScale: ScaleListItemResponse = {
  //     artistQuantity: 5,
  //     membersQuantity: 3,
  //     scaleID: 1,
  //     musicsQuantity: 4,
  //     name: 'Sara Nossa Terra',
  //     scalesQuantity: 2,
  //     songKeysQuantity: 3,
  //   };

  //   const mockedScales: ScaleListItemResponse[] = [
  //     {
  //       artistQuantity: 5,
  //       membersQuantity: 3,
  //       scaleID: 1,
  //       musicsQuantity: 4,
  //       name: 'Sara Nossa Terra',
  //       scalesQuantity: 2,
  //       songKeysQuantity: 3,
  //     },
  //     expectedScale,
  //   ];

  //   when(mockScaleApiService.getScaleListItems()).thenReturn(of(mockedScales));
  //   const scaleApiServiceInstance = instance(mockScaleApiService);

  //   const { store } = setup(scaleApiServiceInstance, mockHotToastService, mockRouter);

  //   store.findAll().subscribe((scalesRetrieved) => {
  //     expect(scalesRetrieved).toEqual(mockedScales);
  //   });

  //   store.setActiveScale(expectedScale.scaleID);

  //   const expectedState: ScaleState = {
  //     scales: mockedScales,
  //     currentScale: expectedScale,
  //   };

  //   expect(store.getCurrentState()).toEqual(expectedState);
  // });

  // it('should create a scale', () => {
  //   const mockedScaleResponse: ScaleListItemResponse = {
  //     artistQuantity: 5,
  //     membersQuantity: 3,
  //     scaleID: 1,
  //     musicsQuantity: 4,
  //     name: 'Sara Nossa Terra',
  //     scalesQuantity: 2,
  //     songKeysQuantity: 3,
  //   };

  //   const scaleRequest: ScaleRequest = {
  //     name: 'Sara Nossa Terra',
  //     ownerID: 1,
  //   };

  //   when(mockScaleApiService.create(scaleRequest)).thenReturn(of(mockedScaleResponse));
  //   const scaleApiServiceInstance = instance(mockScaleApiService);

  //   const { store } = setup(scaleApiServiceInstance, mockHotToastService, mockRouter);

  //   store.create(scaleRequest);

  //   const expectedState: ScaleState = {
  //     currentScale: undefined,
  //     scales: [mockedScaleResponse],
  //   };

  //   expect(store.getCurrentState()).toEqual(expectedState);
  // });

  // it('should delete a scale from the store', () => {
  //   const targetScale: ScaleListItemResponse = {
  //     artistQuantity: 5,
  //     membersQuantity: 3,
  //     scaleID: 1,
  //     musicsQuantity: 4,
  //     name: 'Sara Nossa Terra',
  //     scalesQuantity: 2,
  //     songKeysQuantity: 3,
  //   };

  //   const mockedScales: ScaleListItemResponse[] = [targetScale];

  //   when(mockScaleApiService.getScaleListItems()).thenReturn(of(mockedScales));
  //   when(mockScaleApiService.delete(targetScale.scaleID)).thenReturn(of(true));

  //   const scaleApiServiceInstance = instance(mockScaleApiService);
  //   const { store } = setup(scaleApiServiceInstance, mockHotToastService, mockRouter);

  //   store.findAll().subscribe((scalesRetrieved) => {
  //     expect(scalesRetrieved).toEqual(mockedScales);
  //   });

  //   store.remove(targetScale.scaleID);

  //   const expectedState: ScaleState = {
  //     scales: [],
  //     currentScale: undefined,
  //   };

  //   expect(store.getCurrentState()).toEqual(expectedState);
  // });
});
