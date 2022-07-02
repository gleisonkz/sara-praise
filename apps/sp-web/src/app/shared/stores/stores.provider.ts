import { Provider } from '@angular/core';

import { ArtistStore } from './artist/artist.store';
import { MemberStore } from './member/member.store';
import { MinisterSongKeyStore } from './minister-song-key/minister-song-key.store';
import { MinistryStore } from './ministry/ministry.store';
import { ScaleStore } from './scale/scale.store';
import { SongStore } from './song/song.store';

export const STORES: Provider[] = [
  MinistryStore,
  ScaleStore,
  ArtistStore,
  MemberStore,
  SongStore,
  MinisterSongKeyStore,
];
