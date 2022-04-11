import { Injectable } from '@angular/core';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';
import { ArtistApiService } from '@sp/web/domain/ministry/services';
import { ArtistState } from '@sp/web/domain/ministry/state';

import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistFacade {
  constructor(
    private readonly service: ArtistApiService,
    private readonly state: ArtistState,
    private readonly toastService: HotToastService
  ) {}

  artists$: Observable<ArtistResponse[]> = this.state.artists$;

  getArtists(ministryID: number) {
    this.service.getArtists(ministryID).subscribe((artists) => {
      this.state.artists = artists;
    });
  }

  addArtist(ministryID: number, artistRequest: ArtistRequest): void {
    this.service.createArtist(ministryID, artistRequest).subscribe((newArtist) => {
      this.state.addArtist(newArtist);
      this.toastService.success('Artista criado com sucesso!');
    });
  }

  clearArtists() {
    this.state.clearArtists();
  }

  // removeArtist(ministryID: number): void {
  //   this.service.deleteArtist(ministryID).subscribe(() => {
  //     this.state.removeArtist(ministryID);
  //     this.toastService.success('Artista removido com sucesso!');
  //   });
  // }
}
