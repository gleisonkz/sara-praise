import { Ministry } from '@prisma/client';

export const MINISTRIES: Omit<Ministry, 'ministryID'>[] = [
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
