import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';
import { createMinistry, loadMinistryListItems } from '@sp/store/ministry/actions';
import { selectAllMinistryListItems } from '@sp/store/ministry/selectors';

// import { MinistryListItemResponse } from '@sp/shared-interfaces';
// import { loadMinistryListItems } from '@sp/web/store/ministry';
import { FormControl } from '@ngneat/reactive-forms';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/sp-web/src/app/store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl('', Validators.required);
  ministryListItems$: Observable<MinistryListItemResponse[]>;

  constructor(private readonly store: Store<AppState>) {
    this.ministryListItems$ = this.store.select(selectAllMinistryListItems);
  }

  ngOnInit(): void {
    this.store.dispatch(loadMinistryListItems());
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value,
      ownerID: 1,
    };

    this.store.dispatch(createMinistry({ ministry }));
  }
}
