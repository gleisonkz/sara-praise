import { eMinistryRole, eSongKey } from '@sp/api/enums';
import { Member, Ministry, Song } from '@sp/api/models';

import { User } from 'apps/sp-api/src/app/models/user.model';
import { DEFAULT_ROLES, MOCK_ROLES } from './roles.mock';

const DEFAULT_USER: User = {
  userID: 1,
  name: 'Renato da Silva',
  email: '',
  imageUrl: 'https://randomuser.me/api/portraits/men/92.jpg',
  password: '',
};

const SNT_SONGS: Song[] = [
  {
    songID: 1,
    title: 'Cantar de Deus',
    artist: {
      artistID: 1,
      name: 'Sample Artist',
    },
    bpm: 120,
    key: eSongKey.A,
    tags: ['teste', 'teste2'],
    observation: 'Teste de observação',
    audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    chordsLink: '',
    lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    songID: 2,
    title: 'Cantar de Deus 2',
    artist: {
      artistID: 1,
      name: 'Sample Artist',
    },
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
    songID: 3,
    title: 'Cantar de Deus 3',
    artist: {
      artistID: 1,
      name: 'Sample Artist',
    },
    bpm: 120,
    key: eSongKey.A,
    tags: ['teste', 'teste2'],
    observation: 'Teste de observação',
    audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    chordsLink: '',
    lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
];

const SNT_MEMBERS: Member[] = [
  {
    memberID: 1,
    user: DEFAULT_USER,
    name: 'Renato',
    roles: [MOCK_ROLES[eMinistryRole.BASS], MOCK_ROLES[eMinistryRole.GUITAR]],
    permissions: [],
  },
  {
    memberID: 2,
    user: {
      userID: 2,
      name: 'Renata da Silva',
      email: '',
      imageUrl: 'https://randomuser.me/api/portraits/women/92.jpg',
      password: '',
    },
    name: 'Jane',
    roles: [MOCK_ROLES[eMinistryRole.BASS], MOCK_ROLES[eMinistryRole.GUITAR], MOCK_ROLES[eMinistryRole.MINISTER]],
    permissions: [],
  },
];

export const MINISTRIES_MOCK: Ministry[] = [
  {
    ministryID: 1,
    name: 'Sara Nossa Terra',
    ownerId: 1,
    members: SNT_MEMBERS,
    keys: [
      {
        keyID: 1,
        keyLabel: 'C',
        songID: 1,
        memberID: 1,
      },
      {
        keyID: 2,
        keyLabel: 'E',
        songID: 2,
        memberID: 1,
      },
    ],
    ministryKeys: [
      {
        ministryKeyID: 1,
        keyID: 1,
        memberID: 1,
        ministryID: 1,
        songID: 1,
      },
    ],
    roles: DEFAULT_ROLES,
    scales: [
      {
        scaleID: 1,
        title: 'Arena',
        notes: 'Teste Obs',
        date: new Date(),
        members: [SNT_MEMBERS[0]],
        songs: [SNT_SONGS[0]],
      },
      {
        scaleID: 2,
        title: 'Arena 2',
        notes: 'Teste Obs',
        date: new Date(),
        members: SNT_MEMBERS,
        songs: [SNT_SONGS[0], SNT_SONGS[1]],
      },
    ],
    songs: SNT_SONGS,
  },
  {
    ministryID: 2,
    name: 'Lagoinha',
    ownerId: 2,
    keys: [],
    ministryKeys: [],
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
        name: 'Renato',
        roles: [MOCK_ROLES[eMinistryRole.BASS], MOCK_ROLES[eMinistryRole.GUITAR]],
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
    keys: [],
    ministryKeys: [],
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
        title: 'Todo mundo pulando',
        artist: {
          artistID: 1,
          name: 'Fernandinho',
        },
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
        title: 'Os anjos te louvam',
        artist: {
          artistID: 1,
          name: 'Eli Soares',
        },
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
