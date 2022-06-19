import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { ScaleListItemResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { Observable, switchMap, tap } from 'rxjs';

export interface ScaleState {
  scales: ScaleListItemResponse[];
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

  // findByID(scaleID: number): Observable<ScaleListItemResponse> {
  //   const currentScale$ = this.selectState((state) => {
  //     return state.scales.find((scale) => scale.scaleID === scaleID);
  //   });

  //   return currentScale$.pipe(
  //     switchMap((currentScale) => {
  //       if (currentScale) return of(currentScale);
  //       return this.scaleApiService.getScaleListItems(scaleID).pipe(map(([scale]) => scale));
  //     }),
  //     switchMap((scale) => {
  //       this.setState((state) => ({ ...state, currentScale: scale }));
  //       return of(scale);
  //     })
  //   );
  // }

  // create(ministryID: number, scaleRequest: ScaleRequest, callback?: () => void): void {
  //   this.scaleApiService.create(ministryID, scaleRequest).subscribe((scale) => {
  //     this.setState((state) => ({ ...state, scales: [...state.scales, scale] }));
  //     this.toastService.success('Ministério criado com sucesso!');
  //     if (callback) callback();
  //   });
  // }

  remove(scaleID: number): void {
    this.scaleApiService.delete(scaleID).subscribe(() => {
      this.setState((state) => ({
        ...state,
        scales: state.scales.filter((item) => item.scaleID !== scaleID),
      }));

      this.toastService.success('Ministério removido com sucesso!');
    });
  }
}
