import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { ScaleDetailResponse, ScaleListItemResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { filter, Observable, of, switchMap, tap } from 'rxjs';

export interface ScaleState {
  scales: ScaleListItemResponse[];
  currentScale?: ScaleDetailResponse;
}

export const SCALE_INITIAL_STATE: ScaleState = {
  scales: [],
};

@Injectable()
export class ScaleStore extends NgSimpleStateBaseStore<ScaleState> {
  constructor(
    injector: Injector,
    private readonly scaleApiService: ScaleApiService,
    private readonly toastService: HotToastService,
    private readonly router: Router
  ) {
    super(injector);
  }

  initialState(): ScaleState {
    return SCALE_INITIAL_STATE;
  }

  findAll(ministryID: number): Observable<ScaleListItemResponse[]> {
    return this.scaleApiService.findAll(+ministryID).pipe(
      tap((scales) => {
        this.setState((state) => ({ ...state, scales }));
      }),
      switchMap(() => this.selectState((state) => state.scales))
    );
  }

  selectScaleDetail(ministryID: number, scaleID: number): Observable<ScaleDetailResponse> {
    const currentScale$ = this.selectState((state) => {
      return state.currentScale;
    });

    return currentScale$.pipe(
      switchMap((currentScale) => {
        if (currentScale) return of(currentScale);
        return this.scaleApiService.getScaleListItemDetails(ministryID, scaleID);
      }),
      switchMap((scale) => {
        this.setState((state) => ({ ...state, currentScale: scale }));
        return of(scale);
      })
    );
  }

  remove(ministryID: number, scaleID: number) {
    this.scaleApiService.delete(ministryID, scaleID).subscribe(() => {
      this.setState((state) => ({
        ...state,
        scales: state.scales.filter((item) => item.scaleID !== scaleID),
      }));

      this.toastService.success('Escala removida com sucesso!');
      this.router.navigate(['ministerios', ministryID, 'escalas']);
    });
  }
}
