import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const LIST_STAGGER = trigger('listStagger', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        stagger('50ms', animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))),
      ],
      { optional: true }
    ),
  ]),
]);
