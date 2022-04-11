import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ArtistRequest } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import {
    ArtistApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/artist.api.service';
import { MinistryApiService } from '../../core/services/ministry.api.service';

@Component({
  templateUrl: './artist-dialog.component.html',
  styleUrls: ['./artist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDialog {
  constructor(
    public readonly ministryService: MinistryApiService,
    public readonly artistApiService: ArtistApiService,
    @Inject(MAT_DIALOG_DATA) private ministryID: number
  ) {}

  artistControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  submitForm() {
    if (this.artistControl.invalid) return;

    const artistRequest: ArtistRequest = {
      name: this.artistControl.value,
    };

    this.artistApiService.createArtist(this.ministryID, artistRequest);
  }
}
