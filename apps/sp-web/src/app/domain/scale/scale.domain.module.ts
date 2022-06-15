import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LogPipeWidgetModule } from '@sp/web/widget/pipes';

import {
    ScaleSongsDialog
} from 'apps/sp-web/src/app/domain/scale/components/scale-songs/scale-songs.dialog';
import { ScaleHostPage } from 'apps/sp-web/src/app/domain/scale/scale.host.component';
import {
    EmptyListNoMessageWidgetModule
} from 'apps/sp-web/src/app/widget/components/empty-list-no-message/empty-list-no-message.widget.module';
import {
    SongListItemWidgetModule
} from 'apps/sp-web/src/app/widget/components/song-list-item/song-list-item.widget.module';
import { DisableControlDirective } from 'apps/sp-web/src/app/widget/directives/disable-control';
import { SpForDirectiveWidgetModule } from 'apps/sp-web/src/app/widget/directives/for.directive';
import {
    MediaIfDirectiveWidgetModule
} from 'apps/sp-web/src/app/widget/directives/media-if/media-if.widget.module';
import {
    SetOnSelectValueRefDirective
} from 'apps/sp-web/src/app/widget/directives/set-on-select-value-ref/set-on-select-value-ref.directive';
import {
    SetOnSelectDirective
} from 'apps/sp-web/src/app/widget/directives/set-on-select/set-on-select.directive';
import { MatTimepickerModule } from 'mat-timepicker';
import { ParticipantsDialog } from './components/participants/participants.dialog';
import { ScaleCreateEditPage } from './pages/scale-create-edit/scale-create-edit.page';
import { ScaleViewPage } from './pages/scale-view/scale-view.page';
import { ScaleRoutingModule } from './scale-routing.module';

@NgModule({
  declarations: [ScaleHostPage, ScaleCreateEditPage, ScaleViewPage, ParticipantsDialog, ScaleSongsDialog],
  imports: [
    SongListItemWidgetModule,
    MatDatepickerModule,
    MatIconModule,
    LogPipeWidgetModule,
    MatNativeDateModule,
    SetOnSelectDirective,
    SetOnSelectValueRefDirective,
    CommonModule,
    EmptyListNoMessageWidgetModule,
    DisableControlDirective,
    MatSelectModule,
    MediaIfDirectiveWidgetModule,
    SpForDirectiveWidgetModule,
    ReactiveFormsModule,
    ScaleRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatTimepickerModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatMenuModule,
    MatToolbarModule,
  ],
})
export class ScaleDomainModule {}
