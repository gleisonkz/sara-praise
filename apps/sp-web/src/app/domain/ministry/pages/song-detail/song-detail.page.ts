import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDetailPage {}
