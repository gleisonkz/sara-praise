import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { DisableControlDirective } from './disable-control.directive';

const DEFAULT_IMPORTS = [ReactiveFormsModule, DisableControlDirective, CommonModule];

@Component({
  template: `
    <form [formGroup]="testGroup">
      <input type="text" formControlName="testControl" [attr.data-testid]="'form-input'" [spDisableControl]="mode" />
    </form>
  `,
  standalone: true,
  imports: DEFAULT_IMPORTS,
})
class TestComponent {
  testGroup = new FormGroup({
    testControl: new FormControl(''),
  });
  mode: boolean;
}

fdescribe('DisableControlDirective', () => {
  it('should enable control if condition is not provided.', async () => {
    await render(TestComponent, {
      componentProperties: {
        mode: false,
      },
    });

    const $input: HTMLInputElement = screen.getByTestId('form-input');
    expect($input.disabled).toBe(false);
  });

  it('should disable control if condition is true.', async () => {
    await render(TestComponent, {
      imports: DEFAULT_IMPORTS,
      componentProperties: {
        mode: true,
      },
    });

    const $input: HTMLInputElement = screen.getByTestId('form-input');
    expect($input.disabled).toBe(true);
  });
});
