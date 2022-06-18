import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
})
export class ArtistDialog {
  constructor(
    public readonly ministryService: MinistryApiService,
    public readonly artistApiService: ArtistApiService,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number }
  ) {}

  artistControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  submitForm() {
    if (this.artistControl.invalid) return;

    const artistRequest: ArtistRequest = {
      name: this.artistControl.value.trim(),
    };

    this.artistApiService.createArtist(this.data.ministryID, artistRequest).subscribe();
  }
}
