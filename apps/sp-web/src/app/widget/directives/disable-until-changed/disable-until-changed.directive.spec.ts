import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { DisableUntilChangedDirective } from './disable-until-changed.directive';

@Component({
  template: `
    <input type="text" [formControl]="testControl" [attr.data-testid]="'form-input'" [spDisableUntilChanged] />
  `,
})
class TestComponent {
  testControl: FormControl;
}

const DEFAULT_IMPORTS = [ReactiveFormsModule, DisableUntilChangedDirective];

fdescribe('DisableUntilChangedDirective', () => {
  it('should be disabled if value is not changed', async () => {
    const { findByTestId } = await render(TestComponent, {
      imports: DEFAULT_IMPORTS,
      componentProperties: {
        testControl: new FormControl(['sample', Validators.required]),
      },
    });

    const input = (await findByTestId('form-input')) as HTMLInputElement;

    userEvent.type(input, 'sample');

    expect(input).toBeDisabled();
  });

  it('should be enabled if value is changed', async () => {
    await render(TestComponent, {
      imports: DEFAULT_IMPORTS,
      componentProperties: {
        testControl: new FormControl(['', Validators.required]),
      },
    });

    const input = await screen.findByTestId('form-input');
    userEvent.type(input, 'a');

    expect(input).not.toBeDisabled();
  });
});
