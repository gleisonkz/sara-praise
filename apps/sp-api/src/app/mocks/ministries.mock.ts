import { eSongKey } from '@sp/api/enums';
import { Ministry } from '@sp/api/models';

import { User } from 'apps/sp-api/src/app/models/user.model';
import { DEFAULT_ROLES } from './roles.mock';

const DEFAULT_USER: User = {
  userID: 1,
  name: 'João da Silva',
  email: '',
  imageUrl: 'https://randomuser.me/api/portraits/men/92.jpg',
  password: '',
};

export const MINISTRIES_MOCK: Ministry[] = [
  {
    ministryID: 1,
    name: 'Sara Nossa Terra',
    ownerId: 1,
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
        name: 'Renato',
        roles: [],
        permissions: [],
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [
      {
        scaleID: 1,
        title: 'Arena',
        notes: 'Teste Obs',
        date: new Date(),
        members: [],
        songs: [
          {
            songID: 1,
            title: 'Cantar de Deus',
            artistName: 'João da Silva',
            bpm: 120,
            key: eSongKey.A,
            tags: ['teste', 'teste2'],
            observation: 'Teste de observação',
            audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        ],
      },
      {
        scaleID: 2,
        title: 'Arena 2',
        notes: 'Teste Obs',
        date: new Date(),
        members: [],
        songs: [
          {
            songID: 1,
            title: 'Cantar de Deus',
            artistName: 'João da Silva',
            bpm: 120,
            key: eSongKey.A,
            tags: ['teste', 'teste2'],
            observation: 'Teste de observação',
            audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
          {
            songID: 2,
            title: 'Cantar de Deus 2',
            artistName: 'João da Silva',
            bpm: 120,
            key: eSongKey.A,
            tags: ['teste', 'teste2'],
            observation: 'Teste de observação',
            audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          },
        ],
      },
    ],
    songs: [
      {
        songID: 1,
        title: 'Cantar de Deus',
        artistName: 'João da Silva',
        bpm: 120,
        key: eSongKey.A,
        tags: ['teste', 'teste2'],
        observation: 'Teste de observação',
        audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
  {
    ministryID: 2,
    name: 'Lagoinha',
    ownerId: 2,
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
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
    ministryID: 3,
    name: 'Getsemani',
    ownerId: 3,
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
        name: 'Renato',
        roles: [],
        permissions: [],
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [],
    songs: [
      {
        songID: 1,
        title: 'Cantar de Deus',
        artistName: 'João da Silva',
        bpm: 120,
        key: eSongKey.A,
        tags: ['teste', 'teste2'],
        observation: 'Teste de observação',
        audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        songID: 2,
        title: 'Cantar de Deus 2',
        artistName: 'João da Silva',
        bpm: 120,
        key: eSongKey.A,
        tags: ['teste', 'teste2'],
        observation: 'Teste de observação',
        audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        chordsLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
];
