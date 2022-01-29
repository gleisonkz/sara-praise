import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MinistriesPage } from './pages/ministries/ministries.page';

const routes: Routes = [
  { path: '', redirectTo: 'ministerios', pathMatch: 'full' },
  { path: 'ministerios', component: MinistriesPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
