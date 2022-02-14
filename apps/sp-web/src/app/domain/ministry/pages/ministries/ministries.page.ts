import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl('', Validators.required);
  ministryListItems$: Observable<MinistryListItemResponse[]>;

  constructor() {
    console.log('MinistriesPage.constructor');
  }

  ngOnInit(): void {
    console.log('MinistriesPage.ngOnInit');
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value,
      ownerID: 1,
    };

    console.log('MinistriesPage.createMinistry', ministry);
  }
}
