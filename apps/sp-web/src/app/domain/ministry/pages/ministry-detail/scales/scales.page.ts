import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ScaleListItemResponse } from '@sp/shared-interfaces';

import { Observable, of } from 'rxjs';

export const SCALE_LISTE_ITEMS_MOCK: ScaleListItemResponse[] = [
  {
    scaleID: 1,
    title: 'Arena',
    notes: 'Teste de observação',
    songsQuantity: 2,
    date: new Date(),
    imagesUrl: ['https://randomuser.me/api/portraits/men/92.jpg', 'https://randomuser.me/api/portraits/men/52.jpg'],
  },
  {
    scaleID: 2,
    title: 'Celebração de Inverno',
    notes: 'Teste de observação',
    songsQuantity: 5,
    date: new Date(),
    imagesUrl: ['https://randomuser.me/api/portraits/men/32.jpg'],
  },
];

@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalesPage {
  scaleListItems$: Observable<ScaleListItemResponse[]> = of(SCALE_LISTE_ITEMS_MOCK);
}
