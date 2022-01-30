import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';
import { MinistryDetailRouteService } from './services/ministry-detail-route.service';

const routes: Routes = [
  { path: '', component: MinistriesPage },
  {
    path: ':id',
    component: MinistryDetailPage,
    children: [
      { path: '', redirectTo: 'escalas', pathMatch: 'full' },
      { path: 'escalas', component: ScalesPage },
      { path: 'musicas', component: SongsPage },
      { path: 'membros', component: MembersPage },
      { path: 'tonalidades', component: KeysPage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MinistryDetailRouteService],
})
export class MinistryRoutingModule {}
