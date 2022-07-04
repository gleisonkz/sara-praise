import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MemberListItemResponse, MemberRequest } from '@sp/shared-interfaces';
import { MemberApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import {
    MEMBER_INITIAL_STATE, MemberState
} from 'apps/sp-web/src/app/shared/stores/member/member.store';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { NgSimpleStateModule } from 'ng-simple-state';
import { EMPTY, of } from 'rxjs';
import { anyNumber, instance, mock, verify, when } from 'ts-mockito';
import { MemberStore } from './member.store';

function setup(memberApiService: MemberApiService, toastService: HotToastService, ministryStore: MinistryStore) {
  const injector = TestBed.inject(Injector);
  const memberStore = new MemberStore(injector, memberApiService, toastService, ministryStore);

  return { store: memberStore };
}

describe('[Store] => Member', () => {
  const mockMemberApiService = mock(MemberApiService);
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
    const { store } = setup(mockMemberApiService, mockHotToastService, mockMinistryStore);

    expect(store.getCurrentState()).toEqual(MEMBER_INITIAL_STATE);
    expect(store.getCurrentState()).not.toBeNull();
  });

  it('should retrieve all members', () => {
    const members: MemberListItemResponse[] = [
      {
        imageUrl: '',
        memberID: 38,
        name: 'Teste',
        roles: [],
      },
    ];

    when(mockMemberApiService.findAll(anyNumber())).thenReturn(of(members));
    const memberApiServiceInstance = instance(mockMemberApiService);

    const { store } = setup(memberApiServiceInstance, mockHotToastService, mockMinistryStore);

    const SOME_MINISTRY_ID = 1;

    store.findAll(SOME_MINISTRY_ID).subscribe((membersRetrieved) => {
      expect(membersRetrieved).toEqual(members);
    });

    expect(store.getCurrentState()).toEqual({
      ...MEMBER_INITIAL_STATE,
      members,
    });

    verify(mockMemberApiService.findAll(SOME_MINISTRY_ID)).once();
  });

  it('should create a member', () => {
    const mockedMemberResponse: MemberListItemResponse = {
      name: 'Some Name',
      imageUrl: '',
      memberID: 38,
      roles: [],
    };

    const memberRequest: MemberRequest = {
      name: 'Some Name',
      email: 'any@email.com',
      imageUrl: '',
      password: '123456',
      roles: [],
    };

    const SOME_MINISTRY_ID = 1;

    when(mockMemberApiService.create(SOME_MINISTRY_ID, memberRequest)).thenReturn(of(mockedMemberResponse));
    const memberApiServiceInstance = instance(mockMemberApiService);

    const { store } = setup(memberApiServiceInstance, mockHotToastService, mockMinistryStore);

    store.create(SOME_MINISTRY_ID, memberRequest).subscribe((memberRetrieved) => {
      expect(memberRetrieved).toEqual(mockedMemberResponse);

      const expectedState: MemberState = {
        members: [mockedMemberResponse],
      };

      expect(store.getCurrentState()).toEqual(expectedState);
      verify(mockMemberApiService.create(SOME_MINISTRY_ID, memberRequest)).once();
      verify(mockMinistryStore.incrementMembersQuantity).once();
    });
  });

  it('should delete a member from the store', () => {
    const targetMember: MemberListItemResponse = {
      name: 'Some Name',
      imageUrl: '',
      memberID: 38,
      roles: [],
    };

    const mockedMembers: MemberListItemResponse[] = [targetMember];
    const SOME_MINISTRY_ID = 1;

    when(mockMemberApiService.findAll(SOME_MINISTRY_ID)).thenReturn(of(mockedMembers));
    when(mockMemberApiService.remove(SOME_MINISTRY_ID, targetMember.memberID)).thenReturn(EMPTY);

    const memberApiServiceInstance = instance(mockMemberApiService);
    const { store } = setup(memberApiServiceInstance, mockHotToastService, mockMinistryStore);

    store.findAll(SOME_MINISTRY_ID).subscribe((membersRetrieved) => {
      expect(membersRetrieved).toEqual(mockedMembers);
    });

    const expectedState: MemberState = {
      members: [],
    };

    store.remove(SOME_MINISTRY_ID, targetMember.memberID).subscribe(() => {
      expect(store.getCurrentState().members).toEqual(expectedState);

      verify(mockMemberApiService.findAll(SOME_MINISTRY_ID)).once();
      verify(mockMemberApiService.remove(SOME_MINISTRY_ID, targetMember.memberID)).once();
      verify(mockMinistryStore.decrementMembersQuantity()).once();
    });
  });
});
