import { Injectable } from '@angular/core';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import {
    MinistryService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.service';
import {
    MinistriesState as MinistryState
} from 'apps/sp-web/src/app/domain/ministry/core/state/ministries.state';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MinistryFacade {
  constructor(
    private readonly service: MinistryService,
    private readonly state: MinistryState,
    private readonly toastService: HotToastService
  ) {}

  ministries$: Observable<MinistryListItemResponse[]> = this.state.ministries$;
  ministry$: Observable<MinistryListItemResponse> = this.state.activeMinistry$;

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
}
