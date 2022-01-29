import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';
import { AuthService, MinistryService } from '@sp/web/services';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl();

  constructor(
    public readonly ministryService: MinistryService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.ministryService.getMinistryListItems();
  }

  createMinistry() {
    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value,
      ownerID: this.authService.user.userID,
    };

    // this.ministryService.createMinistry(ministry);
    this.ministryNameControl.setValue('');
  }

  goToMinistryDetail(ministryListItem: MinistryListItemResponse) {
    this.router.navigate(['/ministerios', ministryListItem.ministryID]);
  }
}
