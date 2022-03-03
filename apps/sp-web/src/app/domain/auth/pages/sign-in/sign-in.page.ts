import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AuthService } from '../../auth.service';

@Component({
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage implements OnInit {
  userForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.createForm();
  }

  submit() {
    if (!this.userForm.valid) return;

    const user = this.userForm.value;
    this.authService.login(user.email, user.password).subscribe((isLoggedIn) => {
      if (!isLoggedIn) return this.userForm.reset();

      this.router.navigate(['/']);
    });
  }

  createForm(): void {
    const form = new FormGroup({
      email: new FormControl('gleisonsubzerokz@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', Validators.required),
    });

    this.userForm = form;
  }
}
