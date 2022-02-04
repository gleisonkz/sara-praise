import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { SongListItemComponent } from './song-list-item.component';

@NgModule({
  imports: [MatIconModule, CommonModule],
  declarations: [SongListItemComponent],
  exports: [SongListItemComponent],
})
export class SongListItemWidgetModule {}
