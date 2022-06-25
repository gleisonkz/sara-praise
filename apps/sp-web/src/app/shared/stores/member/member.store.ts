import { Injectable, Injector } from '@angular/core';

import { MemberListItemResponse } from '@sp/shared-interfaces';
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

  findAll(ministryID: number): Observable<MemberListItemResponse[]> {
    return this.memberApiService.findAll(+ministryID).pipe(
      tap((members) => {
        this.setState((state) => ({ ...state, members }));
      }),
      switchMap(() => this.selectState((state) => state.members))
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
