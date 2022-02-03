import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';
import { MinistryService } from '../../services/ministry.service';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl(null, Validators.required);

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
      this.ministryNameControl.setValue('');
    });
  }
}
