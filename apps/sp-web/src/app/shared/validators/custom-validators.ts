import { FormControl } from '@angular/forms';

export class CustomValidators {
  static untilChanged(initialValue: string | undefined): any {
    return (control: FormControl) => {
      const value = control.value;
      const changed = value !== initialValue;
      return changed ? null : { untilValueChanged: true };
    };
  }
}
