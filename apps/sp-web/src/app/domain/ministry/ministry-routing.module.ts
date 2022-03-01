import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { MinistryDetailRouteService } from './core/services/ministry-detail-route.service';
import {
    KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';

const routes: Routes = [
  { path: '', component: MinistriesPage },
  {
    path: ':ministryID',
    component: MinistryDetailPage,
    children: [
      { path: '', redirectTo: 'escalas', pathMatch: 'full' },
      { path: 'escalas', component: ScalesPage },
      { path: 'musicas', component: SongsPage },
      { path: 'membros', component: MembersPage },
      { path: 'tonalidades', component: KeysPage },
    ],
  },

  {
    path: ':ministryID/escalas',
    loadChildren: () => import('@sp/web/domain/scale').then((m) => m.ScaleDomainModule),
  },
];

@NgModule({
  imports: [MatMenuModule, MatButtonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MinistryDetailRouteService],
})
export class MinistryRoutingModule {}
