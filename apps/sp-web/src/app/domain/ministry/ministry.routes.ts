import { Routes } from '@angular/router';

import { ScaleCreateEditPage } from '../scale/pages/scale-create-edit/scale-create-edit.page';
import { ScaleRouterPage } from '../scale/pages/scale-router/scale-router.page';
import { ScaleViewPage } from '../scale/pages/scale-view/scale-view.page';
import {
    ArtistsPage, KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';

export const MINISTRY_ROUTES: Routes = [
  { path: '', component: MinistriesPage },
  {
    path: ':ministryID',
    component: MinistryDetailPage,
    children: [
      { path: '', redirectTo: 'escalas', pathMatch: 'full' },
      {
        path: 'escalas',
        component: ScaleRouterPage,
        children: [
          {
            path: '',
            component: ScalesPage,
          },
          {
            path: 'create',
            component: ScaleCreateEditPage,
          },
          {
            path: ':scaleID/edit',
            component: ScaleCreateEditPage,
          },
          {
            path: ':scaleID/view',
            component: ScaleViewPage,
          },
          { path: ':scaleID', redirectTo: ':scaleID/view', pathMatch: 'full' },
        ],
      },
      { path: 'musicas', component: SongsPage },
      { path: 'artistas', component: ArtistsPage },
      { path: 'membros', component: MembersPage },
      { path: 'tonalidades', component: KeysPage },
    ],
  },
];
