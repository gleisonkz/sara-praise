import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { MinistryModule } from './ministry/ministry.module';

@Module({
  imports: [MinistryModule, AuthModule, ConfigModule.forRoot()],
  controllers: [],
})
export class AppModule {}
