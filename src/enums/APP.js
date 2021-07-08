export const APP_STEPS = {
  SCAN: {
    SCANNING: {
      en: 'Scanning ...',
      nb: 'Skanner ...'
    },
    HEADER: {
      en: 'Scan for files on \'linuxstamme\'',
      nb: 'Skanne etter filer på \'linuxstamme\''
    },
    PLACEHOLDER: {
      en: 'A valid path like \'/ssb/stamme01\'',
      nb: 'En gyldig sti, som \'/ssb/stamme01\''
    },
    COMPLETE: {
      en: 'Scan complete, files can now be listed below',
      nb: 'Skann ferdig, filer kan listes ut under'
    }
  },
  LIST: {
    HEADER: {
      en: 'Select file',
      nb: 'Velg fil'
    },
    PASTE_PATH: {
      en: 'Use same path from scan',
      nb: 'Bruk samme sti som ved skann'
    },
    SIMPLE_LIST: {
      en: 'Simple list?',
      nb: 'Enkel liste?'
    },
    FILTER_LIST: {
      en: 'Filter list',
      nb: 'Filtrere liste'
    },
    SELECTED_FILE: {
      en: 'Selected file',
      nb: 'Valgt fil'
    },
    FILE: {
      SIZE: {
        en: 'Size',
        nb: 'Størrelse'
      },
      CREATED: {
        en: 'Created',
        nb: 'Opprettet'
      },
      MODIFIED: {
        en: 'Last modified',
        nb: 'Sist endret'
      }
    }
  },
  COPY: {
    INITIATE_COPY: {
      en: 'Initiate copy',
      nb: 'Start kopiering'
    },
    COPY_INITIATED: {
      en: 'Copy initiated',
      nb: 'Kopiering startet'
    },
    COPYING: {
      en: 'Copying file ...',
      nb: 'Kopierer fil ...'
    },
    COPY_COMPLETE: {
      en: 'Copy complete!',
      nb: 'Kopiering ferdig!'
    },
    HEADER: {
      en: 'List scanned files and copy',
      nb: 'List ut skannede filer og kopier'
    },
    GO_TO_OPERATION: {
      en: 'View file and select operation',
      nb: 'Gå til fil og velg operasjon'
    }
  },
  HEAD: {
    HEADER: {
      en: 'Check file contents',
      nb: 'Vis innhold i fil'
    },
    LINES_TO_SHOW: {
      en: 'Lines to show',
      nb: 'Vis antall linjer'
    },
    CHARSET: {
      en: 'Charset',
      nb: 'Karaktersett'
    },
    DELIMITER: {
      en: 'Delimiter',
      nb: '\'Delimiter\''
    }
  },
  OPERATION: {
    HEADER: {
      en: 'List copied files',
      nb: 'List ut kopierte filer'
    },
    CSV: {
      DETERMINE_STRUCTURE: {
        en: 'Determine csv file structure',
        nb: 'Fastslå csv filstruktur'
      },
      BOUNDARY_TYPE: {
        en: 'Boundary type',
        nb: 'Grensetype'
      },
      VALUATION: {
        en: 'Valuation',
        nb: 'Verdivurdering'
      },
      CONVERT_AFTER_IMPORT: {
        en: 'Convert after import?',
        nb: 'Konverter etter import?'
      },
      CONVERTER_SKIP_ON_FAILURE: {
        en: 'converterSkipOnFailure?',
        nb: 'converterSkipOnFailure?'
      },
      PSEDUO: {
        en: 'Pseudo?',
        nb: 'Pseudo?'
      },
      EDIT_JSON: {
        en: 'Manually edit JSON before import?',
        nb: 'Manuelt editere JSON før import?'
      },
      QUOTE: {
        en: 'Quote (for line breaks)',
        nb: 'Quote (for linjeskift)'
      }
    },
    IMPORT: {
      INITIATE_IMPORT: {
        en: 'Initiate import',
        nb: 'Start importering'
      },
      IMPORTING: {
        en: 'Importing ...',
        nb: 'Importerer ...'
      },
      IMPORT_COMPLETE: {
        en: 'Import done!',
        nb: 'Importering ferdig!'
      },
      FOUND_IN_BUCKET: {
        en: 'File can be found in bucket',
        nb: 'Filen finner du i bøtte'
      },
      AFTER_CONVERSION: {
        en: 'after conversion is complete',
        nb: 'etter konvertering er ferdig'
      },
      EDIT_JSON: {
        en: 'Check JSON',
        nb: 'Sjekk JSON'
      }
    },
    ARCHIVE: {
      TRIGGER_UNPACK: {
        en: 'Unpack',
        nb: 'Pakk ut'
      },
      WAIT_FOR_UNPACK: {
        en: 'You have to wait for the unpack process to complete, but status has been saved and can be tracked later if you leave.',
        nb: 'Du må vente på utpakkingsprosessen, men statusen er lagret og kan alltid sjekkes senere hvis du avslutter.'
      },
      UNPACKING: {
        en: 'Unpacking ...',
        nb: 'Pakker ut ...'
      },
      UNPACK_COMPLETE: {
        en: 'Unpack complete!',
        nb: 'Utpakking ferdig!'
      },
      CONTENT_TYPE: {
        en: 'contentType',
        nb: 'contentType'
      },
      ADD_V1_MANIFEST: {
        en: 'convertAddV1Manifest',
        nb: 'convertAddV1Manifest'
      }
    }
  },
  STATUS: {
    PLACEHOLDER: {
      en: 'Status id (uuid)',
      nb: 'Statusid (uuid)'
    },
    MY_STATUSES: {
      en: 'My statuses',
      nb: 'Mine statuser'
    },
    CHECK_STATUS: {
      en: 'Check status',
      nb: 'Sjekk status'
    },
    ADD_STATUS: {
      en: 'Add to my statuses',
      nb: 'Legg til i mine statuser'
    },
    CLEAR_STORAGE: {
      SINGLE_TEXT: {
        en: 'Remove this status?',
        nb: 'Fjern denne statusen?'
      },
      TEXT: {
        en: 'Remove all your statuses?',
        nb: 'Fjern alle statusene dine?'
      },
      CANCEL: {
        en: 'Cancel',
        nb: 'Avbryt'
      },
      CONFIRM: {
        en: 'Yes',
        nb: 'Ja'
      }
    }
  },
  MAGIC: {
    HEADER: {
      en: 'Enter full file path and select operation',
      nb: 'Skriv inn full filsti og velg operasjon'
    },
    PLACEHOLDER: {
      en: 'A valid path with filename, like \'/ssb/stamme01/data.csv\'',
      nb: 'En gyldig sti med filnavn, som \'/ssb/stamme01/data.csv\''
    },
    WAIT_FOR_COPY: {
      en: 'You will be redirected when the copy process completes if you wait, but status has been saved and can be tracked later if you leave.',
      nb: 'Du vil bli videresendt når kopieringen er ferdig hvis du venter, men statusen er lagret og kan alltid sjekkes senere hvis du avslutter.'
    },
    CONTINUE: {
      en: 'Move forward ...',
      nb: 'Gå videre ...'
    }
  }
}
