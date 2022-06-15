import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { DisableControlDirective } from './disable-control.directive';

@Component({
  template: `
    <form [formGroup]="testGroup">
      <input type="text" formControlName="testControl" [attr.data-testid]="'form-input'" [dmcDisableControl]="mode" />
    </form>
  `,
})
class TestComponent {
  testGroup = new FormGroup({
    testControl: new FormControl(['']),
  });
  mode: boolean;
}

const DEFAULT_IMPORTS = [ReactiveFormsModule];
const DEFAULT_DECLARATIONS = [DisableControlDirective];

fdescribe('DisableControlDirective', () => {
  it('should enable control if condition is not provided.', async () => {
    await render(TestComponent, {
      declarations: DEFAULT_DECLARATIONS,
      imports: DEFAULT_IMPORTS,
      componentProperties: {
        mode: false,
      },
    });

    const $input: HTMLInputElement = screen.getByTestId('form-input');
    expect($input.disabled).toBe(false);
  });

  it('should disable control if condition is true.', async () => {
    await render(TestComponent, {
      declarations: DEFAULT_DECLARATIONS,
      imports: DEFAULT_IMPORTS,
      componentProperties: {
        mode: true,
      },
    });

    const $input: HTMLInputElement = screen.getByTestId('form-input');
    expect($input.disabled).toBe(true);
  });
});
