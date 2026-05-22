export const FBEVENTS_VERSIONS = {
  cdn: {
    label: 'Current (CDN)',
    description: 'Latest version served by Facebook',
    url: 'https://connect.facebook.net/en_US/fbevents.js',
  },
  '2019-12-09': {
    label: 'Dec 2019',
    description: 'Wayback snapshot 20191209103708 — radio-button UI, no big-button SubscribedButtonClick',
    url: '/fbevents-2019-12-09.js',
  },
  '2021-03-02': {
    label: 'Mar 2021',
    description: 'Wayback snapshot 20210302184552 — big-button UI; SubscribedButtonClick on label clicks requires buttonSelector:extended in pixel config',
    url: '/fbevents-2021-03-02.js',
  },
}

export const DEFAULT_PIXEL_ID = '1308318914571848'
