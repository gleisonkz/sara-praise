import { ContentChildren, Directive, HostListener, Input, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
    SetOnSelectValueRefDirective
} from 'apps/sp-web/src/app/widget/directives/set-on-select-value-ref/set-on-select-value-ref.directive';

@Directive({
  selector: '[spSetOnSelect]',
  standalone: true,
})
export class SetOnSelectDirective<T> {
  @ContentChildren(SetOnSelectValueRefDirective) childDirectives: QueryList<SetOnSelectValueRefDirective<T>>;
  @Input('spSetOnSelect') targetControl: FormControl;

  @HostListener('selectionChange', ['$event'])
  @HostListener('change', ['$event'])
  setValue(event: any) {
    const targetID = event?.value || event?.target?.value;
    const valueToSet = this.childDirectives.find((child) => child.valueToSet.key === targetID)?.valueToSet.value;
    this.targetControl.setValue(valueToSet);
  }
}
