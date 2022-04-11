import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import {
    MinistryApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.api.service';
import { MinistryState } from 'apps/sp-web/src/app/domain/ministry/core/state/ministry.state';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MinistryFacade {
  constructor(
    private readonly service: MinistryApiService,
    private readonly state: MinistryState,
    private readonly toastService: HotToastService,
    private readonly router: Router
  ) {}

  ministries$: Observable<MinistryListItemResponse[]> = this.state.ministries$;

  get ministry$(): Observable<MinistryListItemResponse> {
    return this.getActiveMinistry();
  }

  getMinistries() {
    this.service.getMinistryListItems().subscribe((ministries) => {
      this.state.ministries = ministries;
    });
  }

  addMinistry(ministryRequest: MinistryRequest): void {
    this.service.createMinistry(ministryRequest).subscribe((newMinistry) => {
      this.state.addMinistry(newMinistry);
      this.toastService.success('Ministério criado com sucesso!');
    });
  }

  setActiveMinistry(ministryID: number): void {
    const currentMinistry = this.state.ministries.find((ministry) => ministry.ministryID === ministryID);
    if (!currentMinistry) return;

    this.state.activeMinistry = currentMinistry;
  }

  getMinistryByID(ministryID: number): Observable<MinistryListItemResponse> {
    return this.service.getMinistryListItems(ministryID).pipe(
      map(([ministry]) => {
        this.state.activeMinistry = ministry;
        return ministry;
      })
    );
  }

  removeMinistry(ministryID: number): void {
    this.service.deleteMinistry(ministryID).subscribe(() => {
      this.state.removeMinistry(ministryID);
      this.toastService.success('Ministério removido com sucesso!');
    });
  }

  private getActiveMinistry(): Observable<MinistryListItemResponse> {
    const MINISTRY_ID_EXPRESSION = /(?<=ministerios\/)\d/;
    const [ministryID] = this.router.url.match(MINISTRY_ID_EXPRESSION) || [];

    return this.state.activeMinistry$.pipe(
      switchMap((activeMinistry) => {
        if (!activeMinistry) return this.getMinistryByID(+ministryID);

        return of(activeMinistry);
      })
    );
  }
}
