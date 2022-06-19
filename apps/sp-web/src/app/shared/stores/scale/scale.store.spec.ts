// import { Injector } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';

// import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';
// import { MinistryApiService } from '@sp/web/domain/ministry/services';

// import { HotToastService } from '@ngneat/hot-toast';
// import { NgSimpleStateModule } from 'ng-simple-state';
// import { of } from 'rxjs';
// import { anything, instance, mock, verify, when } from 'ts-mockito';
// import { MINISTRY_INITIAL_STATE, MinistryState, MinistryStore } from './scale.store';

// function setup(ministryApiService: MinistryApiService, toastService: HotToastService, router: Router) {
//   const injector = TestBed.inject(Injector);
//   const ministryStore = new MinistryStore(injector, ministryApiService, toastService, router);

//   return { store: ministryStore };
// }

// describe('MinistryStore', () => {
//   const mockMinistryApiService = mock(MinistryApiService);
//   const mockHotToastService = mock(HotToastService);
//   const mockRouter = mock(Router);

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         NgSimpleStateModule.forRoot({
//           enableDevTool: false,
//           enableLocalStorage: false,
//         }),
//       ],
//     });
//   });

//   it('should successfully get initial state', () => {
//     const { store } = setup(mockMinistryApiService, mockHotToastService, mockRouter);

//     expect(store.getCurrentState()).toEqual(MINISTRY_INITIAL_STATE);
//     expect(store.getCurrentState()).not.toBeNull();
//   });

//   it('should retrieve all ministries', () => {
//     const ministries: MinistryListItemResponse[] = [
//       {
//         artistQuantity: 5,
//         membersQuantity: 3,
//         ministryID: 1,
//         musicsQuantity: 4,
//         name: 'Sara Nossa Terra',
//         scalesQuantity: 2,
//         songKeysQuantity: 3,
//       },
//     ];

//     when(mockMinistryApiService.getMinistryListItems()).thenReturn(of(ministries));
//     const ministryApiServiceInstance = instance(mockMinistryApiService);

//     const { store } = setup(ministryApiServiceInstance, mockHotToastService, mockRouter);

//     store.findAll().subscribe((ministriesRetrieved) => {
//       expect(ministriesRetrieved).toEqual(ministries);
//     });

//     expect(store.getCurrentState()).toEqual({
//       ...MINISTRY_INITIAL_STATE,
//       ministries,
//     });

//     verify(mockMinistryApiService.getMinistryListItems()).once();
//   });

//   it('should retrieve a ministry by ID', () => {
//     const ministry: MinistryListItemResponse = {
//       artistQuantity: 5,
//       membersQuantity: 2,
//       ministryID: 1,
//       musicsQuantity: 4,
//       name: 'Sara Nossa Terra',
//       scalesQuantity: 2,
//       songKeysQuantity: 3,
//     };

//     const someID = 1;

//     when(mockMinistryApiService.getMinistryListItems(anything())).thenReturn(of([ministry]));
//     const ministryApiServiceInstance = instance(mockMinistryApiService);

//     const { store } = setup(ministryApiServiceInstance, mockHotToastService, mockRouter);

//     store.findByID(someID).subscribe((ministryRetrieved) => {
//       expect(ministryRetrieved).toEqual(ministry);
//     });

//     const expectedState: MinistryState = {
//       currentMinistry: undefined,
//       ministries: [ministry],
//     };

//     expect(store.getCurrentState()).toEqual(expectedState);
//     verify(mockMinistryApiService.getMinistryListItems(someID)).once();
//   });

//   it('should set current ministry by ID', () => {
//     const expectedMinistry: MinistryListItemResponse = {
//       artistQuantity: 5,
//       membersQuantity: 3,
//       ministryID: 1,
//       musicsQuantity: 4,
//       name: 'Sara Nossa Terra',
//       scalesQuantity: 2,
//       songKeysQuantity: 3,
//     };

//     const mockedMinistries: MinistryListItemResponse[] = [
//       {
//         artistQuantity: 5,
//         membersQuantity: 3,
//         ministryID: 1,
//         musicsQuantity: 4,
//         name: 'Sara Nossa Terra',
//         scalesQuantity: 2,
//         songKeysQuantity: 3,
//       },
//       expectedMinistry,
//     ];

//     when(mockMinistryApiService.getMinistryListItems()).thenReturn(of(mockedMinistries));
//     const ministryApiServiceInstance = instance(mockMinistryApiService);

//     const { store } = setup(ministryApiServiceInstance, mockHotToastService, mockRouter);

//     store.findAll().subscribe((ministriesRetrieved) => {
//       expect(ministriesRetrieved).toEqual(mockedMinistries);
//     });

//     store.setActiveMinistry(expectedMinistry.ministryID);

//     const expectedState: MinistryState = {
//       ministries: mockedMinistries,
//       currentMinistry: expectedMinistry,
//     };

//     expect(store.getCurrentState()).toEqual(expectedState);
//   });

//   it('should create a ministry', () => {
//     const mockedMinistryResponse: MinistryListItemResponse = {
//       artistQuantity: 5,
//       membersQuantity: 3,
//       ministryID: 1,
//       musicsQuantity: 4,
//       name: 'Sara Nossa Terra',
//       scalesQuantity: 2,
//       songKeysQuantity: 3,
//     };

//     const ministryRequest: MinistryRequest = {
//       name: 'Sara Nossa Terra',
//       ownerID: 1,
//     };

//     when(mockMinistryApiService.create(ministryRequest)).thenReturn(of(mockedMinistryResponse));
//     const ministryApiServiceInstance = instance(mockMinistryApiService);

//     const { store } = setup(ministryApiServiceInstance, mockHotToastService, mockRouter);

//     store.create(ministryRequest);

//     const expectedState: MinistryState = {
//       currentMinistry: undefined,
//       ministries: [mockedMinistryResponse],
//     };

//     expect(store.getCurrentState()).toEqual(expectedState);
//   });

//   it('should delete a ministry from the store', () => {
//     const targetMinistry: MinistryListItemResponse = {
//       artistQuantity: 5,
//       membersQuantity: 3,
//       ministryID: 1,
//       musicsQuantity: 4,
//       name: 'Sara Nossa Terra',
//       scalesQuantity: 2,
//       songKeysQuantity: 3,
//     };

//     const mockedMinistries: MinistryListItemResponse[] = [targetMinistry];

//     when(mockMinistryApiService.getMinistryListItems()).thenReturn(of(mockedMinistries));
//     when(mockMinistryApiService.delete(targetMinistry.ministryID)).thenReturn(of(true));

//     const ministryApiServiceInstance = instance(mockMinistryApiService);
//     const { store } = setup(ministryApiServiceInstance, mockHotToastService, mockRouter);

//     store.findAll().subscribe((ministriesRetrieved) => {
//       expect(ministriesRetrieved).toEqual(mockedMinistries);
//     });

//     store.remove(targetMinistry.ministryID);

//     const expectedState: MinistryState = {
//       ministries: [],
//       currentMinistry: undefined,
//     };

//     expect(store.getCurrentState()).toEqual(expectedState);
//   });
// });
