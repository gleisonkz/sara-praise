import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { AuthService } from '../../auth.service';

@Component({
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
  ],
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
    this.authService.signIn(user.email, user.password).subscribe((isLoggedIn) => {
      if (!isLoggedIn) return this.userForm.reset();

      this.router.navigate(['/']);
    });
  }

  createForm(): void {
    const form = new FormGroup({
      email: new FormControl('gleison@teste.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    });

    this.userForm = form;
  }
}
