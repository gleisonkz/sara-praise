import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { ARTIST_SEEDS } from './seeds/artists.seed';
import { DEFAULT_ROLES } from './seeds/roles.seed';
import { SONG_KEYS } from './seeds/song-keys.seed';
import { SONGS_SEEDS } from './seeds/songs.seed';

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding...');

  await prisma.role.createMany({
    data: DEFAULT_ROLES,
  });

  await prisma.songKey.createMany({
    data: SONG_KEYS,
  });

  const passwordHash = await argon.hash('123456');

  await prisma.user.create({
    data: {
      name: 'Gleison',
      email: 'gleison@teste.com',
      imageURL: 'https://randomuser.me/api/portraits/men/52.jpg',
      password: passwordHash,
    },
  });

  const ministries = [
    {
      name: 'Sara Nossa Terra',
      ownerID: 1,
    },
    {
      name: 'Lagoinha',
      ownerID: 1,
    },
    {
      name: 'Getsemani',
      ownerID: 1,
    },
  ];

  for await (const { name, ownerID } of ministries) {
    await prisma.ministry.create({
      data: {
        name,
        ownerID,
        members: {
          create: {
            userID: ownerID,
          },
        },
        roles: {
          connect: DEFAULT_ROLES.map(({ roleID }) => ({ roleID })),
        },
      },
    });
  }

  await prisma.artist.createMany({
    data: ARTIST_SEEDS,
  });

  await prisma.song.createMany({
    data: SONGS_SEEDS,
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
