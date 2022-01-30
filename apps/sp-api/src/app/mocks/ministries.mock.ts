import { Ministry } from '@sp/api/models';

import { DEFAULT_ROLES } from './roles.mock';

export const MINISTRIES_MOCK: Ministry[] = [
  {
    ministryID: 1,
    name: 'Sara Nossa Terra',
    ownerId: 1,
    members: [
      {
        userID: 1,
        name: 'Renato',
        roles: [],
        permissions: [],
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [],
    songs: [],
  },
  {
    ministryID: 2,
    name: 'Lagoinha',
    ownerId: 2,
    members: [
      {
        userID: 1,
        name: 'Renato',
        roles: [],
        permissions: [],
      },
      {
        userID: 2,
        name: 'Gabriel',
        roles: [],
        permissions: [],
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [],
    songs: [],
  },
  {
    ministryID: 3,
    name: 'Getsemani',
    ownerId: 3,
    members: [
      {
        userID: 3,
        name: 'Renato',
        roles: [],
        permissions: [],
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [],
    songs: [],
  },
];
