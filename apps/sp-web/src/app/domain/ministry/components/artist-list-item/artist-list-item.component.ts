import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sp-artist-list-item',
  templateUrl: './artist-list-item.component.html',
  styleUrls: ['./artist-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistListItemComponent {
  @Input() artist: any;
}
