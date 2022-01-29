import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  { path: 'ministerios', component: MinistriesPage },
  {
    path: 'ministerios/:id',
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
