export const APP = [
  {
    id: 'copy',
    title: {
      en: 'Copy',
      nb: 'Kopier'
    },
    description: {
      en: 'Copy files from \'linuxstamme\' to migration-agent',
      nb: 'Kopier filer fra \'linuxstamme\' til \'migration-agent\''
    },
    icon: 'copy',
    route: '/copy'
  },
  {
    id: 'list',
    title: {
      en: 'List',
      nb: 'List ut'
    },
    description: {
      en: 'List copied files and select operation',
      nb: 'List ut kopierte filer og velg operasjon'
    },
    icon: 'list',
    route: '/list'
  },
  {
    id: 'operation',
    title: {
      en: 'Operation',
      nb: 'Operasjon'
    },
    description: {
      en: 'Perform operation and import file to GCS',
      nb: 'Utfør operasjon og importer til GCS'
    },
    icon: 'file code',
    route: '/operation'
  }
]
