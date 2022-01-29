import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MinistriesPage, MinistryDetailPage } from './pages';

const routes: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  { path: 'ministerios', component: MinistriesPage },
  {
    path: 'ministerios/:id',
    component: MinistryDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
