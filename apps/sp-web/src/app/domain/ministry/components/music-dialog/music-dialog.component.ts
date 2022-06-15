import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ArtistResponse, KeyResponse } from '@sp/shared-interfaces';
import { ArtistApiService, MinistryApiService } from '@sp/web/domain/ministry/services';

import { SongApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/song.api.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './music-dialog.component.html',
  styleUrls: ['./music-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicDialogComponent implements OnInit {
  songKeys$: Observable<KeyResponse[]>;
  artists$: Observable<ArtistResponse[]>;

  tags: string[] = ['Júbilo', 'Adoração'];

  songForm: UntypedFormGroup;

  constructor(
    public readonly ministryService: MinistryApiService,
    private readonly artistApiService: ArtistApiService,
    private readonly songApiService: SongApiService,
    private readonly matDialogRef: MatDialogRef<MusicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number }
  ) {}

  ngOnInit() {
    this.buildForm();
    this.songKeys$ = this.ministryService.getKeys();
    this.artists$ = this.artistApiService.getArtists(this.data.ministryID);
  }

  buildForm() {
    this.songForm = new UntypedFormGroup({
      title: new UntypedFormControl('Deus cuida de mim'),
      artistID: new UntypedFormControl(''),
      tags: new UntypedFormControl(''),
      keyID: new UntypedFormControl(''),
      observations: new UntypedFormControl('Teste'),
      audioUrl: new UntypedFormControl(''),
      youtubeUrl: new UntypedFormControl(''),
      lyricUrl: new UntypedFormControl(''),
      chordsUrl: new UntypedFormControl(''),
    });
  }

  submitForm() {
    if (!this.songForm.valid) return;
    this.songApiService
      .createSong(this.data.ministryID, this.songForm.value)
      .subscribe(() => this.matDialogRef.close());
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
