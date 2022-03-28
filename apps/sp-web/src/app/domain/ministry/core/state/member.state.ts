import { Injectable } from '@angular/core';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberState {
  private members$$ = new BehaviorSubject<MemberListItemResponse[]>([]);

  get members$(): Observable<MemberListItemResponse[]> {
    return this.members$$.asObservable();
  }

  get members(): MemberListItemResponse[] {
    return this.members$$.value;
  }

  set members(members: MemberListItemResponse[]) {
    this.members$$.next(members);
  }

  addMember(newMember: MemberListItemResponse): void {
    const currentMembers = this.members;
    this.members = [...currentMembers, newMember];
  }

  removeMember(memberID: number): void {
    const currentMembers = this.members;
    this.members = currentMembers.filter((member) => member.memberID !== memberID);
  }
}
