import { Injectable, Injector } from '@angular/core';

import { MemberListItemResponse, MemberRequest } from '@sp/shared-interfaces';
import { MemberApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { Observable, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface MemberState {
  members: MemberListItemResponse[];
}

export const MEMBER_INITIAL_STATE: MemberState = {
  members: [],
};

@Injectable()
export class MemberStore extends NgSimpleStateBaseStore<MemberState> {
  constructor(
    injector: Injector,
    private readonly memberApiService: MemberApiService,
    private readonly toastService: HotToastService,
    private readonly ministryStore: MinistryStore
  ) {
    super(injector);
  }

  initialState(): MemberState {
    return MEMBER_INITIAL_STATE;
  }

  create(ministryID: number, memberRequest: MemberRequest): Observable<MemberListItemResponse> {
    return this.memberApiService.create(ministryID, memberRequest).pipe(
      tap((member) => {
        this.setState((state) => ({ ...state, members: [...state.members, member] }));

        this.ministryStore.incrementMembersQuantity();
        this.toastService.success('Membro criado com sucesso!');
      })
    );
  }

  findAll(ministryID: number): Observable<MemberListItemResponse[]> {
    return this.memberApiService.findAll(+ministryID).pipe(
      tap((members) => {
        this.setState((state) => ({ ...state, members }));
      }),
      switchMap(() => this.selectState((state) => state.members))
    );
  }

  update(ministryID: number, memberID: number, memberRequest: MemberRequest): Observable<MemberListItemResponse> {
    return this.memberApiService.update(ministryID, memberID, memberRequest).pipe(
      tap((member) => {
        this.setState((state) => ({
          ...state,
          members: state.members.map((m) => (m.memberID === memberID ? member : m)),
        }));
        this.toastService.success('Membro atualizado com sucesso!');
      })
    );
  }

  remove(ministryID: number, memberID: number) {
    return this.memberApiService.remove(ministryID, memberID).pipe(
      tap(() => {
        this.setState((state) => ({
          members: state.members.filter((member) => member.memberID !== memberID),
        }));

        this.ministryStore.decrementMembersQuantity();
        this.toastService.success('Membro removido com sucesso!');
      })
    );
  }
}
