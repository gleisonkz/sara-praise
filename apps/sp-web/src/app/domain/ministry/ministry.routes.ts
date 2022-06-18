import { Routes } from '@angular/router';

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
      { path: 'escalas', component: ScalesPage },
      { path: 'musicas', component: SongsPage },
      { path: 'artistas', component: ArtistsPage },
      { path: 'membros', component: MembersPage },
      { path: 'tonalidades', component: KeysPage },
    ],
  },
  {
    path: ':ministryID/escalas',
    loadChildren: () => import('../scale/scale.routes').then((m) => m.SCALE_ROUTES),
  },
];

// @NgModule({
//   imports: [MatMenuModule, MatButtonModule, RouterModule.forChild(MINISTRY_ROUTES)],
//   exports: [RouterModule],
//   providers: [MinistryDetailRouteService],
// })
// export class MinistryRoutingModule {}
