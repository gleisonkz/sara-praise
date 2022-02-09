import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  minValue: Date;
  maxValue: Date;

  ministryNameControl = new FormControl('', Validators.required);

  ministryListItems$: Observable<MinistryListItemResponse[]>;

  constructor(public readonly ministryService: MinistryService) {}

  ngOnInit(): void {
    this.ministryListItems$ = this.ministryService.ministryListItems$;
    this.ministryService.getMinistryListItems().subscribe();
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value,
      ownerID: 1,
    };

    this.ministryService.createMinistry(ministry).subscribe(() => {
      this.ministryNameControl.reset();
    });
  }
}
