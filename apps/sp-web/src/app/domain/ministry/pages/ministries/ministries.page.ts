import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';
import { MinistryFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/minitries.facade';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl('', Validators.required);
  ministries$: Observable<MinistryListItemResponse[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ministryFacade: MinistryFacade
  ) {}

  ngOnInit(): void {
    this.ministries$ = this.ministryFacade.ministries$;
    this.ministryFacade.getMinistries();
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value,
      ownerID: this.authService.user.userID,
    };

    this.ministryFacade.addMinistry(ministry);
  }

  goToMinistryDetails(ministryID: number) {
    this.ministryFacade.setActiveMinistry(ministryID);
    this.router.navigate(['ministerios', ministryID]);
  }
}
