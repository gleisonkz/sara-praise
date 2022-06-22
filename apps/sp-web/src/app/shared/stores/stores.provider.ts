import { Provider } from '@angular/core';

import { ArtistStore } from './artist/artist.store';
import { MinistryStore } from './ministry/ministry.store';
import { ScaleStore } from './scale/scale.store';

export const STORES: Provider[] = [MinistryStore, ScaleStore, ArtistStore];
