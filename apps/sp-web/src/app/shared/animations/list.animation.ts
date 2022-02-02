import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const LIST_ANIMATION = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))], {
      optional: true,
    }),
    query(':leave', animate('200ms', style({ opacity: 0 })), { optional: true }),
  ]),
]);
