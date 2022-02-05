import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyListItemResponse } from '@sp/shared-interfaces';
import { Observable } from 'rxjs';
import { MinistryDetailRouteService } from '../../../services/ministry-detail-route.service';
import { MinistryService } from '../../../services/ministry.service';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<KeyListItemResponse[]>;
  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.keysListItems$ = this.ministryService.getKeyListItem(ministryID);
  }
}
