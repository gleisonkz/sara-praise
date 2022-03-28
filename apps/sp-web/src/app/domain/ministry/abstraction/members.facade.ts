import { Injectable } from '@angular/core';

import { MemberListItemResponse, MemberRequest } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { MemberService } from 'apps/sp-web/src/app/domain/ministry/core/services/member.service';
import { MemberState } from 'apps/sp-web/src/app/domain/ministry/core/state/member.state';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberFacade {
  constructor(
    private readonly service: MemberService,
    private readonly state: MemberState,
    private readonly toastService: HotToastService
  ) {}

  members$: Observable<MemberListItemResponse[]> = this.state.members$;

  getMembers(ministryID: number, roles?: number[]) {
    this.service.getMemberListItems(ministryID, roles).subscribe((members) => {
      this.state.members = members;
    });
  }

  addMember(ministryID: number, memberRequest: MemberRequest): void {
    this.service.createMember(ministryID, memberRequest).subscribe((newMember) => {
      this.state.addMember(newMember);
      this.toastService.success('Membro criado com sucesso!');
    });
  }

  // removeMember(ministryID: number): void {
  //   this.service.deleteMember(ministryID).subscribe(() => {
  //     this.state.removeMember(ministryID);
  //     this.toastService.success('Ministério removido com sucesso!');
  //   });
  // }

  // private getActiveMember(): Observable<MemberListItemResponse> {
  //   const MINISTRY_ID_EXPRESSION = /(?<=ministerios\/)\d/;
  //   const [ministryID] = this.router.url.match(MINISTRY_ID_EXPRESSION) || [];

  //   return this.state.activeMember$.pipe(
  //     switchMap((activeMember) => {
  //       if (!activeMember) return this.getMemberByID(+ministryID);

  //       return of(activeMember);
  //     })
  //   );
  // }
}
