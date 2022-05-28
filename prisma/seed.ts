import { PrismaClient } from '@prisma/client';
import { DEFAULT_ROLES } from './seeds/roles.seed';
import { SONG_KEYS } from './seeds/song-keys.seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: DEFAULT_ROLES,
  });

  await prisma.songKey.createMany({
    data: SONG_KEYS,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
