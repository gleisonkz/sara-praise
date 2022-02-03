import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './member-detail.page.html',
  styleUrls: ['./member-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailPage {}
