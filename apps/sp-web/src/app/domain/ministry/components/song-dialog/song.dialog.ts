import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ArtistResponse, SongKeyResponse, SongResponse } from '@sp/shared-interfaces';
import { ArtistApiService, MinistryApiService } from '@sp/web/domain/ministry/services';
import { SongStore } from '@sp/web/shared/stores';

import { SongDialogData } from 'apps/sp-web/src/app/domain/ministry/pages';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './song.dialog.html',
  styleUrls: ['./song.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatOptionModule,
    MatChipsModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
  ],
})
export class SongDialog implements OnInit {
  songKeys$: Observable<SongKeyResponse[]>;
  artists$: Observable<ArtistResponse[]>;

  tags: string[] = ['Júbilo', 'Adoração'];

  songForm: UntypedFormGroup;

  constructor(
    public readonly ministryService: MinistryApiService,
    private readonly artistApiService: ArtistApiService,
    private readonly dialogRef: MatDialogRef<SongDialog>,
    private readonly songStore: SongStore,
    @Inject(MAT_DIALOG_DATA) private data: SongDialogData
  ) {}

  ngOnInit() {
    if (this.data?.songID)
      this.songStore.findByID(this.data.ministryID, this.data.songID).subscribe((song) => {
        this.songKeys$ = this.ministryService.getKeys(this.data.ministryID);
        this.artists$ = this.artistApiService.findAll(this.data.ministryID);
        this.buildForm(song);
      });

    this.buildForm();
    this.songKeys$ = this.ministryService.getKeys(this.data.ministryID);
    this.artists$ = this.artistApiService.findAll(this.data.ministryID);
  }

  buildForm(songResponse?: SongResponse) {
    this.songForm = new UntypedFormGroup({
      title: new UntypedFormControl(songResponse?.title || ''),
      artistID: new UntypedFormControl(songResponse?.artistID || ''),
      tags: new UntypedFormControl(songResponse?.tags || []),
      keyID: new UntypedFormControl(songResponse?.keyID || ''),
      observations: new UntypedFormControl(songResponse?.observations || ''),
      audioUrl: new UntypedFormControl(songResponse?.audioUrl || ''),
      youtubeUrl: new UntypedFormControl(songResponse?.youtubeUrl || ''),
      lyricUrl: new UntypedFormControl(songResponse?.lyricUrl || ''),
      chordsUrl: new UntypedFormControl(songResponse?.chordsUrl || ''),
    });
  }

  submitForm() {
    if (!this.songForm.valid) return;

    console.log(this.songForm.value);
    console.log(this.data.ministryID);

    if (this.data?.songID)
      return this.songStore
        .update(this.data.ministryID, this.data.songID, this.songForm.value)
        .subscribe(() => this.dialogRef.close());

    return this.songStore.create(this.data.ministryID, this.songForm.value).subscribe(() => this.dialogRef.close());
  }

  onTagRemoved(tag: string) {
    const tagsControl = this.songForm.get('tags') as UntypedFormControl;
    const tags = tagsControl?.value as string[];
    this.removeFirst(tags, tag);
    tagsControl.setValue(tags); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
