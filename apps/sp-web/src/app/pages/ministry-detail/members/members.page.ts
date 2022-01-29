import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPage {}
