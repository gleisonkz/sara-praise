import { Module } from '@nestjs/common';
import { MinistryController } from '@sp/api/controllers';
import { MinistryService } from '@sp/api/services';

@Module({
  imports: [],
  controllers: [MinistryController],
  providers: [MinistryService],
})
export class AppModule {}
