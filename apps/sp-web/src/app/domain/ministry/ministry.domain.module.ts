import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
    EmptyListNoMessageWidgetModule
} from 'apps/sp-web/src/app/widget/components/empty-list-no-message/empty-list-no-message.widget.module';
import { SpForDirectiveWidgetModule } from 'apps/sp-web/src/app/widget/directives/for.directive';
import {
    MediaIfDirectiveWidgetModule
} from 'apps/sp-web/src/app/widget/directives/media-if/media-if.widget.module';
import { SongListItemComponent } from './components/song-list-item/song-list-item.component';
import { MinistryRoutingModule } from './ministry-routing.module';
import {
    KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';
import { MemberDetailPage } from './pages/member-detail/member-detail.page';
import { ScaleDetailPage } from './pages/scale-detail/scale-detail.page';
import { SongDetailPage } from './pages/song-detail/song-detail.page';

@NgModule({
  declarations: [
    MinistriesPage,
    MinistryDetailPage,
    SongsPage,
    MinistriesPage,
    ScalesPage,
    MinistryDetailPage,
    MembersPage,
    KeysPage,
    ScaleDetailPage,
    SongDetailPage,
    MemberDetailPage,
    SongListItemComponent,
  ],
  imports: [
    CommonModule,
    EmptyListNoMessageWidgetModule,
    MatSelectModule,
    MediaIfDirectiveWidgetModule,
    SpForDirectiveWidgetModule,
    ReactiveFormsModule,
    MinistryRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
})
export class MinistryDomainModule {}
