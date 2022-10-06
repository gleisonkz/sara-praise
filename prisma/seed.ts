import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { ARTISTS } from './seeds/artists.seed';
import { MINISTER_SONG_KEYS } from './seeds/minister-song-keys.seed';
import { MINISTRIES } from './seeds/ministries.seed';
import { DEFAULT_ROLES } from './seeds/roles.seed';
import { SONG_KEYS } from './seeds/song-keys.seed';
import { SONGS } from './seeds/songs.seed';
import { USERS } from './seeds/users.seed';

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding...');

  console.log('Seeding song keys...');
  SONG_KEYS.forEach(async (songKey) => {
    await prisma.songKey.create({
      data: songKey,
    });
  });

  console.log('Seeding users...');
  await prisma.user.createMany({
    data: await Promise.all(
      USERS.map(async ({ userID, email, imageURL, name }) => ({
        userID,
        name,
        email,
        imageURL,
        password: await argon.hash('123456'),
      }))
    ),
  });

  console.log('Seeding ministries...');
  for await (const { name, ownerID } of MINISTRIES) {
    await prisma.ministry.create({
      data: {
        name,
        ownerID,
      },
    });
  }

  console.log('Seeding roles...');
  for await (const { roleID, name, iconUrl } of DEFAULT_ROLES) {
    await prisma.role.create({
      data: {
        roleID,
        name,
        iconUrl,
        ministries: {
          connect: {
            ministryID: 1,
          },
        },
      },
    });
  }

  console.log('Seeding members...');
  USERS.forEach(async (user) => {
    await prisma.member.create({
      data: {
        user: {
          connect: {
            userID: user.userID,
          },
        },
        ministry: {
          connect: {
            ministryID: 1,
          },
        },
        roles: {
          connect: user.roles.map((roleID) => ({ roleID })),
        },
      },
    });
  });

  console.log('Seeding artists...');
  await prisma.artist.createMany({
    data: ARTISTS,
  });

  console.log('Seeding songs...');
  await prisma.song.createMany({
    data: SONGS,
  });

  console.log('Seeding minister song keys...');
  await prisma.ministerSongKey.createMany({
    data: MINISTER_SONG_KEYS,
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
