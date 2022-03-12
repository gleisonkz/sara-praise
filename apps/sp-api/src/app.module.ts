import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './domain/auth/auth.module';
import { MemberModule } from './domain/member/member.module';
import { MinistryModule } from './domain/ministry/ministry.module';

@Module({
  imports: [MinistryModule, AuthModule, ConfigModule.forRoot(), MemberModule],
  controllers: [],
})
export class AppModule {}
