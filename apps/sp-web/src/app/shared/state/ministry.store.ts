import { Injectable, Injector } from '@angular/core';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';
import { MinistryApiService } from '@sp/web/domain/ministry/services';

import { HotToastService } from '@ngneat/hot-toast';
import { NgSimpleStateBaseStore } from 'ng-simple-state';
import { map, Observable, of, switchMap, tap } from 'rxjs';

export interface MinistryState {
  ministries: MinistryListItemResponse[];
  currentMinistry?: MinistryListItemResponse;
}

export const MINISTRY_INITIAL_STATE: MinistryState = {
  ministries: [],
  currentMinistry: undefined,
};

@Injectable()
export class MinistryStore extends NgSimpleStateBaseStore<MinistryState> {
  constructor(
    injector: Injector,
    private readonly ministryApiService: MinistryApiService,
    private readonly toastService: HotToastService
  ) {
    super(injector);
  }

  initialState(): MinistryState {
    return MINISTRY_INITIAL_STATE;
  }

  findAll(): Observable<MinistryListItemResponse[]> {
    return this.ministryApiService.getMinistryListItems().pipe(
      tap((ministries) => {
        this.setState((state) => ({ ...state, ministries }));
      }),
      switchMap(() => this.selectState((state) => state.ministries))
    );
  }

  findByID(ministryID: number): Observable<MinistryListItemResponse> {
    const currentMinistry$ = this.selectState((state) => {
      return state.ministries.find((ministry) => ministry.ministryID === ministryID);
    });

    return currentMinistry$.pipe(
      switchMap((currentMinistry) => {
        if (currentMinistry) return of(currentMinistry);
        return this.ministryApiService.getMinistryListItems(ministryID).pipe(map(([ministry]) => ministry));
      }),
      switchMap((ministry) => {
        this.setState((state) => ({ ...state, currentMinistry: ministry }));
        return of(ministry);
      })
    );
  }

  setActiveMinistry(ministryID: number): void {
    this.setState((state) => ({
      ...state,
      currentMinistry: state.ministries.find((ministry) => ministry.ministryID === ministryID),
    }));
  }

  create(ministryRequest: MinistryRequest): void {
    this.ministryApiService.create(ministryRequest).subscribe((ministry) => {
      this.setState((state) => ({ ...state, ministries: [...state.ministries, ministry] }));
      this.toastService.success('Ministério criado com sucesso!');
    });
  }

  remove(ministryID: number): void {
    this.ministryApiService.delete(ministryID).subscribe(() => {
      this.setState((state) => ({
        ...state,
        ministries: state.ministries.filter((item) => item.ministryID !== ministryID),
      }));

      this.toastService.success('Ministério removido com sucesso!');
    });
  }
}
