import { FormControl } from '@angular/forms';

import { CustomValidators } from 'apps/sp-web/src/app/shared/validators/custom-validators';

describe('CustomValidators', () => {
  describe('untilChanged', () => {
    it('should return untilChanged error if the value not changed', () => {
      const validator = CustomValidators.distinctFrom('initialValue');
      const control = new FormControl('initialValue');
      const expectedError = { untilChanged: true };
      expect(validator(control)).toEqual(expectedError);
    });

    it('should return null if the value changed', () => {
      const validator = CustomValidators.distinctFrom('initialValue');
      const control = new FormControl('initialValue');
      control.setValue('changedValue');
      expect(validator(control)).toBeNull();
    });
  });
});
