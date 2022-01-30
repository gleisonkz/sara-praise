import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';
import { AuthService, MinistryService } from '../../services';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl(null, Validators.required);

  ministryListItems$: Observable<MinistryListItemResponse[]>;

  constructor(public readonly ministryService: MinistryService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.ministryListItems$ = this.ministryService.ministryListItems$;
    this.ministryService.getMinistryListItems().subscribe();
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    // const ministry: MinistryRequest = {
    //   name: this.ministryNameControl.value,
    //   ownerID: this.authService.user.userID,
    // };

    // this.ministryService.createMinistryListItem(ministry).subscribe(() => {
    //   this.ministryNameControl.setValue('');
    // });
  }
}
