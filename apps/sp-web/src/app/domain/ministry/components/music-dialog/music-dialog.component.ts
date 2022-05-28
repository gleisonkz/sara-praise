/* eslint-disable @ngneat/reactive-forms/no-angular-forms-imports */
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ArtistResponse, KeyResponse } from '@sp/shared-interfaces';
import { ArtistApiService, MinistryApiService } from '@sp/web/domain/ministry/services';

import {
    SongApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/song/song.api.service';
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

  songForm: FormGroup;

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
    this.songForm = new FormGroup({
      title: new FormControl('Deus cuida de mim'),
      artistID: new FormControl(''),
      tags: new FormControl(''),
      keyID: new FormControl(''),
      observations: new FormControl('Teste'),
      audioUrl: new FormControl(''),
      youtubeUrl: new FormControl(''),
      lyricUrl: new FormControl(''),
      chordsUrl: new FormControl(''),
    });
  }

  submitForm() {
    if (!this.songForm.valid) return;
    this.songApiService
      .createSong(this.data.ministryID, this.songForm.value)
      .subscribe(() => this.matDialogRef.close());
  }

  onTagRemoved(tag: string) {
    const tagsControl = this.songForm.get('tags') as FormControl;
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
