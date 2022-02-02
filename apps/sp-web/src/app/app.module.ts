import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LogInterceptor } from 'apps/sp-web/src/app/shared/interceptors/log.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule, BrowserAnimationsModule, ReactiveFormsModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
