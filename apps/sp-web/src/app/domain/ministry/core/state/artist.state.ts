import { Injectable } from '@angular/core';

import { ArtistResponse } from '@sp/shared-interfaces';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistState {
  private artists$$ = new BehaviorSubject<ArtistResponse[]>([]);

  get artists$(): Observable<ArtistResponse[]> {
    return this.artists$$.asObservable();
  }

  get artists(): ArtistResponse[] {
    return this.artists$$.value;
  }

  set artists(artists: ArtistResponse[]) {
    this.artists$$.next(artists);
  }

  addArtist(newArtist: ArtistResponse): void {
    const currentArtists = this.artists;
    this.artists = [...currentArtists, newArtist];
  }

  removeArtist(artistID: number): void {
    const currentArtists = this.artists;
    this.artists = currentArtists.filter((artist) => artist.artistID !== artistID);
  }

  clearArtists(): void {
    this.artists$$.next([]);
  }
}
