import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsPage {}
