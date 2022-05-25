import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
    EmptyListNoMessageWidgetModule, SongListItemWidgetModule
} from '@sp/web/widget/components';
import {
    MediaIfDirectiveWidgetModule, SpForDirectiveWidgetModule
} from '@sp/web/widget/directives';
import { RemoveDotsPipeWidgetModule } from '@sp/web/widget/pipes';

import {
    ArtistDialog
} from 'apps/sp-web/src/app/domain/ministry/components/artist-dialog/artist-dialog.component';
import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import { ArtistListItemComponent } from './components/artist-list-item/artist-list-item.component';
import {
    MinistryKeyDialogComponent
} from './components/ministry-key-dialog/ministry-key-dialog.component';
import { MinistryRoutingModule } from './ministry-routing.module';
import {
    KeysPage, MembersPage, MinistriesPage, MinistryDetailPage, ScalesPage, SongsPage
} from './pages';
import { MemberDetailPage } from './pages/member-detail/member-detail.page';
import { ArtistsPage } from './pages/ministry-detail/artists/artists.page';
import { SongDetailPage } from './pages/song-detail/song-detail.page';
import { MusicDialogComponent } from './components/music-dialog/music-dialog.component';

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
    SongDetailPage,
    MemberDetailPage,
    MinistryKeyDialogComponent,
    MemberDialog,
    ArtistsPage,
    ArtistListItemComponent,
    ArtistDialog,
    MusicDialogComponent,
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    RemoveDotsPipeWidgetModule,
    EmptyListNoMessageWidgetModule,
    MatSelectModule,
    MediaIfDirectiveWidgetModule,
    SpForDirectiveWidgetModule,
    ReactiveFormsModule,
    SongListItemWidgetModule,
    MinistryRoutingModule,
    MatSlideToggleModule,
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
    FormsModule,
    MatToolbarModule,
  ],
})
export class MinistryDomainModule {}
