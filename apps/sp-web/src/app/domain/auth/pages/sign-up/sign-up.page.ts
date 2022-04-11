import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';

@Component({
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  signUpForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  ngOnInit(): void {
    this.createForm();
  }

  signUp() {
    if (!this.signUpForm.valid) return;

    const { name, email, password } = this.signUpForm.value;

    this.authService.signUp({ name, email, password }).subscribe(() => {
      this.signUpForm.reset();
      this.router.navigate(['/']);
    });
  }

  createForm(): void {
    const form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });

    this.signUpForm = form;
  }
}
