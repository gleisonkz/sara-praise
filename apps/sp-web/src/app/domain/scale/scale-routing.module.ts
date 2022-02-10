import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScaleCreateEditPage } from './pages/scale-create-edit/scale-create-edit.page';
import { ScaleViewPage } from './pages/scale-view/scale-view.page';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ScaleRoutingModule {}
