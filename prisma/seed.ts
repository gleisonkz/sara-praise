import { PrismaClient } from '@prisma/client';

const DEFAULT_ROLES = [
  {
    roleID: 1,
    name: 'Ministro',
    iconUrl: 'assets/images/roles/microphone.svg',
  },
  {
    roleID: 2,
    name: 'Guitarra',
    iconUrl: 'assets/images/roles/electric-guitar.svg',
  },
  {
    roleID: 3,
    name: 'Baixo',
    iconUrl: 'assets/images/roles/bass.svg',
  },
  {
    roleID: 4,
    name: 'Bateria',
    iconUrl: 'assets/images/roles/drums.svg',
  },
  {
    roleID: 5,
    name: 'Violão',
    iconUrl: 'assets/images/roles/acoustic-guitar.svg',
  },
  {
    roleID: 6,
    name: 'Teclado',
    iconUrl: 'assets/images/roles/keys.svg',
  },
  {
    roleID: 7,
    name: 'Back Vocal',
    iconUrl: 'assets/images/roles/voice-recorder-mic.svg',
  },
];
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: DEFAULT_ROLES,
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
