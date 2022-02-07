import { Module } from '@nestjs/common';
import { MinistryController } from './controllers';
import { MinistryRepository } from './database/ministry-repository';
import { MinistryService } from './services';

@Module({
  imports: [],
  controllers: [MinistryController],
  providers: [MinistryService, MinistryRepository],
})
export class AppModule {}
