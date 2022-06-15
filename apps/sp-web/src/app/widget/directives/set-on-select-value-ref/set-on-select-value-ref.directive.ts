import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[spSetOnSelectValueRef]',
  standalone: true,
})
export class SetOnSelectValueRefDirective<T> {
  @Input('spSetOnSelectValueRef') valueToSet: { key: string | number; value: T };
}
