import { NgModule } from '@angular/core';

import { RemoveDotsPipe } from './remove-dots.date.pipe';

@NgModule({
  declarations: [RemoveDotsPipe],
  exports: [RemoveDotsPipe],
})
export class RemoveDotsPipeWidgetModule {}
