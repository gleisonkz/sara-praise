import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { FormControl } from '@ngneat/reactive-forms';
import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './ministries.page.html',
  styleUrls: ['./ministries.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatBadgeModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatToolbarModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class MinistriesPage implements OnInit {
  ministryNameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  ministries$: Observable<MinistryListItemResponse[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ministryStore: MinistryStore
  ) {}

  ngOnInit(): void {
    this.ministries$ = this.ministryStore.findAll();
  }

  logout() {
    this.authService.logout();
  }

  createMinistry() {
    if (!this.ministryNameControl.valid) return;

    const ministry: MinistryRequest = {
      name: this.ministryNameControl.value.trim(),
      ownerID: this.authService.user.userID,
    };

    console.log(ministry);

    this.ministryStore.create(ministry, () => this.ministryNameControl.reset());
  }

  goToMinistryDetails(ministryID: number) {
    this.ministryStore.setActiveMinistry(ministryID);
    this.router.navigate(['ministerios', ministryID]);
  }
}
