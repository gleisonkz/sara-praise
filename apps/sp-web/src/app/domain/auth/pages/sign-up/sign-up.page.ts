import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage {
  Roles: any = ['Admin', 'Author', 'Reader'];
}
