import { eSongKey } from '@sp/api/enums';
import { Member, Ministry, Song } from '@sp/api/models';
import { eMinistryRole } from '@sp/shared-interfaces';

import { User } from 'apps/sp-api/src/app/models/user.model';
import { DEFAULT_ROLES, MOCK_ROLES } from './roles.mock';

const USERS_MOCK = {
  KETLEN: {
    userID: 2,
    name: 'Ketlen',
    email: '',
    imageUrl: 'https://randomuser.me/api/portraits/women/92.jpg',
    password: '',
  },
  BRENDA: {
    userID: 3,
    name: 'Brenda',
    email: '',
    imageUrl: 'https://randomuser.me/api/portraits/women/91.jpg',
    password: '',
  },
};

const DEFAULT_USER: User = {
  userID: 1,
  name: 'Amanda',
  email: '',
  imageUrl: 'https://randomuser.me/api/portraits/men/92.jpg',
  password: '',
};

const SNT_SONGS: Song[] = [
  {
    songID: 1,
    title: 'Eu fui comprado',
    artist: {
      artistID: 1,
      name: 'Fernandinho',
    },
    bpm: 120,
    key: eSongKey.Db,
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
  {
    songID: 3,
    title: 'Não Morrerei',
    artist: {
      artistID: 1,
      name: 'Marquinhos Gomes',
    },
    bpm: 120,
    key: eSongKey.A,
    tags: ['teste', 'teste2'],
    observation: 'Teste de observação',
    audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    chordsLink: 'https://www.cifraclub.com.br/marquinhos-gomes/nao-morrerei',
    lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    songID: 4,
    title: 'A Alegria do Senhor',
    artist: {
      artistID: 1,
      name: 'Fernandinho',
    },
    bpm: 120,
    key: eSongKey.Gm,
    tags: ['teste', 'teste2'],
    observation: 'Teste de observação',
    audioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    chordsLink: 'https://www.cifraclub.com.br/fernandinho/a-alegria-do-senhor/',
    lyricLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    songID: 5,
    title: 'Rompendo Em Fé',
    artist: {
      artistID: 2,
      name: 'Kleber Lucas',
    },
    bpm: 120,
    key: eSongKey.A,
    tags: ['teste', 'teste2'],
    observation: 'Teste de observação',
    audioLink: '',
    chordsLink: '',
    lyricLink: '',
    youtubeLink: '',
  },
];

const SNT_MEMBERS: Member[] = [
  {
    memberID: 1,
    user: DEFAULT_USER,
    roles: [MOCK_ROLES[eMinistryRole.GUITAR], MOCK_ROLES[eMinistryRole.MINISTER]],
    permissions: [],
  },
  {
    memberID: 2,
    user: USERS_MOCK.KETLEN,
    roles: [MOCK_ROLES[eMinistryRole.MINISTER]],
    permissions: [],
  },
  {
    memberID: 3,
    user: USERS_MOCK.BRENDA,
    roles: [MOCK_ROLES[eMinistryRole.MINISTER]],
    permissions: [],
  },
];

export const MINISTRIES_MOCK: Ministry[] = [
  {
    ministryID: 1,
    name: 'Sara Nossa Terra',
    ownerId: 1,
    members: SNT_MEMBERS,
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
    ministryKeys: [],
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
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
    ministryKeys: [],
    members: [
      {
        memberID: 1,
        user: DEFAULT_USER,
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
