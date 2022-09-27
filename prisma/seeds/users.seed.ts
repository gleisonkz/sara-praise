import { User } from '@prisma/client';

export const USERS: User[] = [
  {
    userID: 1,
    name: 'Gleison',
    email: 'gleison@teste.com',
    imageURL: 'https://randomuser.me/api/portraits/men/52.jpg',
    password: '',
  },
  {
    userID: 2,
    name: 'Amanda',
    email: 'amanda@teste.com',
    imageURL: 'https://randomuser.me/api/portraits/women/30.jpg',
    password: '',
  },
  {
    userID: 3,
    name: 'Debora',
    email: 'debora@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/306102771_758760921878025_6454453546495370241_n.jpg?ccb=11-4&oh=01_AVxCZJeW3VGyaDQeK9UC7IUGJznluT9j6OXBaqRsKc7X_Q&oe=63424D29',
    password: '',
  },
  {
    userID: 4,
    name: 'Isabely',
    email: 'isabely@teste.com',
    imageURL: 'https://randomuser.me/api/portraits/women/34.jpg',
    password: '',
  },
  {
    userID: 5,
    name: 'Marcos Almeida',
    email: 'marcos@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/162437915_1234660780624122_6571126166566176474_n.jpg?ccb=11-4&oh=01_AVwSyZt_daY9TlIyswCUyXy7B6vbF71IzH3plMFdEQoFVQ&oe=633F9778',
    password: '',
  },
];
