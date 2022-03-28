import { Injectable } from '@angular/core';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MinistryState {
  private ministries$$ = new BehaviorSubject<MinistryListItemResponse[]>([]);
  private activeMinistry$$ = new BehaviorSubject<MinistryListItemResponse>(null as any);

  get ministries$(): Observable<MinistryListItemResponse[]> {
    return this.ministries$$.asObservable();
  }

  get ministries(): MinistryListItemResponse[] {
    return this.ministries$$.value;
  }

  set ministries(ministries: MinistryListItemResponse[]) {
    this.ministries$$.next(ministries);
  }

  get activeMinistry$(): Observable<MinistryListItemResponse> {
    return this.activeMinistry$$.asObservable();
  }

  get activeMinistry(): MinistryListItemResponse {
    return this.activeMinistry$$.value;
  }

  set activeMinistry(activeMinistry: MinistryListItemResponse) {
    this.activeMinistry$$.next(activeMinistry);
  }

  incrementMusicsQuantity(): void {
    const ministry = this.activeMinistry;
    ministry.musicsQuantity++;

    this.activeMinistry = ministry;
  }

  incrementMembersQuantity(): void {
    const ministry = this.activeMinistry;
    ministry.membersQuantity++;
  }

  incrementScalesQuantity(): void {
    const ministry = this.activeMinistry;
    ministry.scalesQuantity++;
  }

  incrementSongKeysQuantity(): void {
    const ministry = this.activeMinistry;
    ministry.songKeysQuantity++;
  }

  addMinistry(newMinistry: MinistryListItemResponse): void {
    const currentMinistries = this.ministries;
    this.ministries = [...currentMinistries, newMinistry];
  }

  removeMinistry(ministryID: number): void {
    const currentMinistries = this.ministries;
    this.ministries = currentMinistries.filter((ministry) => ministry.ministryID !== ministryID);
  }

  getMinistryByID(ministryID: number): MinistryListItemResponse {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);

    if (!ministry) throw new Error(`Ministry with ID ${ministryID} not found`);

    return ministry;
  }
}
