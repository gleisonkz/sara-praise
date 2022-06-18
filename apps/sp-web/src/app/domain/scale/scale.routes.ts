import { Routes } from '@angular/router';

import { ScaleCreateEditPage } from './pages/scale-create-edit/scale-create-edit.page';
import { ScaleViewPage } from './pages/scale-view/scale-view.page';

export const SCALE_ROUTES: Routes = [
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
  { path: '', redirectTo: 'create', pathMatch: 'full' },
];
