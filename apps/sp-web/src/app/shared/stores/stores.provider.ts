import { Provider } from '@angular/core';

import { SongStore } from 'apps/sp-web/src/app/shared/stores/song';
import { ArtistStore } from './artist/artist.store';
import { MemberStore } from './member/member.store';
import { MinistryStore } from './ministry/ministry.store';
import { ScaleStore } from './scale/scale.store';

export const STORES: Provider[] = [MinistryStore, ScaleStore, ArtistStore, MemberStore, SongStore];