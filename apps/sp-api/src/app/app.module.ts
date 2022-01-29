import { Module } from '@nestjs/common';

import { MinistryController } from './controllers';
import { MinistryService } from './services';

@Module({
  imports: [],
  controllers: [MinistryController],
  providers: [MinistryService],
})
export class AppModule {}
