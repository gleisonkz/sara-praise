import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScaleCreateEditPage } from './pages/scale-create-edit/scale-create-edit.page';
import { ScaleViewPage } from './pages/scale-view/scale-view.page';

const routes: Routes = [
  { path: '', redirectTo: 'view', pathMatch: 'full' },
  {
    path: 'edit',
    component: ScaleCreateEditPage,
  },
  {
    path: 'view',
    component: ScaleViewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ScaleRoutingModule {}
