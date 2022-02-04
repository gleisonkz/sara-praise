import { eMinistryRole } from '@sp/api/enums';
import { Role } from '@sp/api/models';

export const MOCK_ROLES = {
  [eMinistryRole.MINISTER]: {
    roleID: 1,
    name: 'Ministro',
    iconUrl: 'assets/images/roles/microphone.svg',
  },
  [eMinistryRole.ELECTRIC_GUITAR]: {
    roleID: 2,
    name: 'Guitarra',
    iconUrl: 'assets/images/roles/electric-guitar.svg',
  },
  [eMinistryRole.BASS]: {
    roleID: 3,
    name: 'Baixo',
    iconUrl: 'assets/images/roles/bass.svg',
  },
  [eMinistryRole.DRUMS]: {
    roleID: 4,
    name: 'Bateria',
    iconUrl: 'assets/images/roles/drums.svg',
  },
  [eMinistryRole.GUITAR]: {
    roleID: 5,
    name: 'Violão',
    iconUrl: 'assets/images/roles/acoustic-guitar.svg',
  },
  [eMinistryRole.KEYBOARD]: {
    roleID: 6,
    name: 'Teclado',
    iconUrl: 'assets/images/roles/keys.svg',
  },
  [eMinistryRole.BACK_VOCAL]: {
    roleID: 7,
    name: 'Back Vocal',
    iconUrl: 'assets/images/roles/voice-recorder-mic.svg',
  },
};

export const DEFAULT_ROLES: Role[] = [
  MOCK_ROLES[eMinistryRole.MINISTER],
  MOCK_ROLES[eMinistryRole.ELECTRIC_GUITAR],
  MOCK_ROLES[eMinistryRole.BASS],
  MOCK_ROLES[eMinistryRole.DRUMS],
  MOCK_ROLES[eMinistryRole.GUITAR],
  MOCK_ROLES[eMinistryRole.KEYBOARD],
  MOCK_ROLES[eMinistryRole.BACK_VOCAL],
];
