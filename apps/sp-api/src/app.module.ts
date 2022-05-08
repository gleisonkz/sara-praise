import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ArtistModule } from 'apps/sp-api/src/domain/artist/artist.module';
import { AuthModule } from './domain/auth/auth.module';
import { MemberModule } from './domain/member/member.module';
import { MinistryModule } from './domain/ministry/ministry.module';
import { SongModule } from './domain/song/song.module';

@Module({
  imports: [MinistryModule, AuthModule, ConfigModule.forRoot(), MemberModule, ArtistModule, SongModule],
  controllers: [],
})
export class AppModule {}
