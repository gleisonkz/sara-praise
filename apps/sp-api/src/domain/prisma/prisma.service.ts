import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await fs.writeFileSync('./prisma/seeds/artists.json', JSON.stringify(await this.artist.findMany()));
    await fs.writeFileSync('./prisma/seeds/songs.json', JSON.stringify(await this.song.findMany()));

    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    return this.$disconnect();
  }

  async cleanDataBase(): Promise<unknown[]> {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
