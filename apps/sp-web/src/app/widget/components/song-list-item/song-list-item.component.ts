import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SongListItemResponse } from '@sp/shared-interfaces';

@Component({
  selector: 'sp-song-list-item',
  template: `
    <div class="icon">
      <ng-content> </ng-content>
    </div>

    <div class="description">
      <span> {{ song.artistName }}</span>
      <span> {{ song.title }}</span>
      <span class="key"> Tom: {{ song.key }} </span>
    </div>

    <div class="links">
      <mat-icon [ngStyle]="{ color: song.hasLyricLink ? '#f0f086' : '' }">format_color_text</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasChordsLink ? '#5ce85c' : '' }">format_indent_increase</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasYoutubeLink ? '#f46161' : '' }">live_tv</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasAudioLink ? 'rgb(78 165 255)' : '' }">music_note</mat-icon>
    </div>
  `,
  styleUrls: ['./song-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListItemComponent {
  @Input() song: SongListItemResponse;
}
