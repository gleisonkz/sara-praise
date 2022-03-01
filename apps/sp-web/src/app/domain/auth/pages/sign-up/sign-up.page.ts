import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';

@Component({
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage implements OnInit {
  userForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  ngOnInit(): void {
    this.createForm();
  }

  submit() {
    console.log(this.userForm.value);
  }

  createForm(): void {
    const form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });

    this.userForm = form;
  }
}
