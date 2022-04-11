import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';

@Component({
  templateUrl: './artists.page.html',
  styleUrls: ['./artists.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsPage implements OnInit {
  artistListItems$: Observable<any[]>;

  ngOnInit(): void {
    this.artistListItems$ = of([]);
  }
}
