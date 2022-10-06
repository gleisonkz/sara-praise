enum eMinistryRole {
  MINISTER = 1,
  ELECTRIC_GUITAR,
  BASS,
  DRUMS,
  GUITAR,
  KEYBOARD,
  BACK_VOCAL,
}

export const USERS = [
  {
    userID: 1,
    name: 'Gleison',
    email: 'gleison@teste.com',
    imageURL:
      'https://scontent.fplu31-1.fna.fbcdn.net/v/t39.30808-6/305507305_4653210561448398_828592149001525372_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=730e14&_nc_ohc=5VjRV_rVdykAX9DfyQu&_nc_oc=AQkS6mnf53FDtS3j0jmZg8pidSQipS7quYYXi2ziRZ4fgc9N9hwH2yhXRtoE47199eidLSuQPlaiJyA06XAP2anI&_nc_ht=scontent.fplu31-1.fna&oh=00_AT-gAzNY68CLhQ2xjQ5SurHo7NKAht1qCzC4GwRbxhcoBQ&oe=633D93C9',
    password: '',
    roles: [eMinistryRole.BASS, eMinistryRole.KEYBOARD],
  },
  {
    userID: 2,
    name: 'Diego',
    email: 'diego@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/307487018_123533447135125_8387970758117199908_n.jpg?ccb=11-4&oh=01_AVyBF8ko7g9Cy5bKHIpNLje46hxxXWa0Ngy58emuT5XCcQ&oe=63465BDE',
    password: '',
    roles: [eMinistryRole.BASS, eMinistryRole.KEYBOARD],
  },
  {
    userID: 3,
    name: 'Amanda',
    email: 'amanda@teste.com',
    imageURL:
      'https://scontent.fplu31-1.fna.fbcdn.net/v/t39.30808-6/310382939_2262076860634206_191475391184968734_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=QGKlZxc8MHcAX_Fq7Ux&_nc_ht=scontent.fplu31-1.fna&oh=00_AT8HD-mj4kHBq8b9iXBLZdOH_uEIPqOLzxJaMJX63uNAcA&oe=633C71A0',
    password: '',
    roles: [eMinistryRole.MINISTER, eMinistryRole.BACK_VOCAL],
  },
  {
    userID: 4,
    name: 'Debora',
    email: 'debora@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/306102771_758760921878025_6454453546495370241_n.jpg?ccb=11-4&oh=01_AVxCZJeW3VGyaDQeK9UC7IUGJznluT9j6OXBaqRsKc7X_Q&oe=63424D29',
    password: '',
    roles: [eMinistryRole.MINISTER, eMinistryRole.BACK_VOCAL],
  },
  {
    userID: 5,
    name: 'Isabely',
    email: 'isabely@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/299231855_471038407846608_3278029711832220843_n.jpg?ccb=11-4&oh=01_AVyw1cO4m1v331PWJgBc7YWSIEa00KLp-6oNCPfuLVlI2Q&oe=6348EA0C',
    password: '',
    roles: [eMinistryRole.MINISTER, eMinistryRole.BACK_VOCAL],
  },
  {
    userID: 6,
    name: 'Marcos Almeida',
    email: 'marcos@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/162437915_1234660780624122_6571126166566176474_n.jpg?ccb=11-4&oh=01_AVwSyZt_daY9TlIyswCUyXy7B6vbF71IzH3plMFdEQoFVQ&oe=633F9778',
    password: '',
    roles: [eMinistryRole.MINISTER, eMinistryRole.BACK_VOCAL],
  },
  {
    userID: 7,
    name: 'Matheus Petram',
    email: 'matheuspteste@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/229874773_611452710031733_7729025570420027968_n.jpg?ccb=11-4&oh=01_AVw2H6rHsmxP7Sc2fp-_Egiv_4k3QCDTKM0EsFX17_eNag&oe=634584E4',
    password: '',
    roles: [eMinistryRole.ELECTRIC_GUITAR],
  },
  {
    userID: 8,
    name: 'Deivid',
    email: 'deivid@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/156514163_606857647778392_637264745906703931_n.jpg?ccb=11-4&oh=01_AVwlp2UGGgRK6J9t1OI0v6l6k5hF6LkswQHP3-6aWC9TXA&oe=634612C8',
    password: '',
    roles: [eMinistryRole.DRUMS],
  },
  {
    userID: 9,
    name: 'Denis',
    email: 'denis@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/299497822_178174614723784_853327828133624037_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVxYu5xIxo0TywfxI3TvOReQcGDR7IHzg2pPNoiFZ-NgAw&oe=6345DEF2',
    password: '',
    roles: [eMinistryRole.KEYBOARD],
  },
  {
    userID: 10,
    name: 'Mauricio',
    email: 'mauricio@teste.com',
    imageURL:
      'https://pps.whatsapp.net/v/t61.24694-24/292922120_706780920384277_8416852178234977410_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVyD6psIekR5-SuIN3frBn85J0VptnBaN2G2fxl3OSFOXA&oe=63497CB5',
    password: '',
    roles: [eMinistryRole.GUITAR],
  },
];
