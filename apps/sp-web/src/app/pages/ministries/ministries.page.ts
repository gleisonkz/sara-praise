import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MinistryListItemRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';
import { AuthService, MinistryService } from '../../services';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl();

  ministryListItems$: Observable<MinistryListItemResponse[]>;

  constructor(
    public readonly ministryService: MinistryService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.ministryListItems$ = this.ministryService.getMinistryListItems();
  }

  createMinistry() {
    const ministry: MinistryListItemRequest = {
      name: this.ministryNameControl.value,
      ownerID: this.authService.user.userID,
    };

    // this.ministryService.createMinistry(ministry);
    this.ministryNameControl.setValue('');
  }
}
