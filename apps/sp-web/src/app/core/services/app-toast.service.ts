import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class AppToastService {
  constructor(readonly hotToastService: HotToastService) {}

  success(message: string) {
    this.hotToastService.success(message);
  }

  error(message: string) {
    this.hotToastService.error(message);
  }

  warning(message: string) {
    this.hotToastService.warning(message);
  }
}
