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
      <span> Tom: {{ song.key }} </span>
    </div>

    <div class="links">
      <mat-icon [ngStyle]="{ color: song.hasLyricLink ? 'yellow' : '' }">format_color_text</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasChordsLink ? 'green' : '' }">format_indent_increase</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasYoutubeLink ? 'red' : '' }">live_tv</mat-icon>
      <mat-icon [ngStyle]="{ color: song.hasAudioLink ? 'blue' : '' }">music_note</mat-icon>
    </div>
  `,
  styleUrls: ['./song-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListItemComponent {
  @Input() song: SongListItemResponse;
}
