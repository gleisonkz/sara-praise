import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import { ArtistStore } from 'apps/sp-web/src/app/shared/stores/artist/artist.store';
import { CustomValidators } from 'apps/sp-web/src/app/shared/validators/custom-validators';
import { DisableControlDirective } from 'apps/sp-web/src/app/widget/directives/disable-control';

@Component({
  templateUrl: './artist-dialog.component.html',
  styleUrls: ['./artist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    DisableControlDirective,
    CommonModule,
  ],
})
export class ArtistDialog implements OnInit {
  constructor(
    private readonly artistStore: ArtistStore,
    private readonly dialogRef: MatDialogRef<ArtistDialog>,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number; artist?: ArtistResponse }
  ) {}

  artistControl: FormControl<string>;

  ngOnInit(): void {
    this.artistControl = new FormControl(this.data.artist?.name, [
      Validators.required,
      Validators.minLength(3),
      CustomValidators.distinctFrom(this.data.artist?.name),
    ]);
  }

  submitForm() {
    if (this.artistControl.invalid) return;

    const artistRequest: ArtistRequest = {
      name: this.artistControl.value.trim(),
    };

    if (this.data?.artist?.artistID)
      return this.artistStore
        .update(this.data.ministryID, this.data.artist.artistID, artistRequest)
        .subscribe(() => this.dialogRef.close());

    return this.artistStore.create(this.data.ministryID, artistRequest).subscribe(() => this.dialogRef.close());
  }
}
