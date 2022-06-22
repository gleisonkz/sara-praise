import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static distinctFrom(initialValue: string | undefined): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      const changed = value !== initialValue;

      const untilChanged: ValidationErrors = {
        untilChanged: true,
      };

      return changed ? null : untilChanged;
    };
  }
}
