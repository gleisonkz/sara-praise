import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[spDisableControl]',
  standalone: true,
})
export class DisableControlDirective implements OnChanges {
  @Input('spDisableControl') condition: boolean;

  constructor(private ngControl: NgControl) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition) {
      const action = this.condition ? 'disable' : 'enable';
      const control = this.ngControl.control;
      if (!control) return;
      control[action]();
    }
  }
}
