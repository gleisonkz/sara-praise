import { Directive, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[spDisableUntilChanged]',
  standalone: true,
})
export class DisableUntilChangedDirective implements OnInit {
  constructor(private ngControl: NgControl) {}

  ngOnInit(): void {
    const control = this.ngControl.control;
    if (!control) return;

    const initialValue = this.ngControl.value;
    console.log('initialValue', initialValue);

    control.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      const changed = value !== initialValue;
      console.log('changed', changed);
      const stateFn = changed ? 'enable' : 'disable';
      control[stateFn]();
    });
  }
}
