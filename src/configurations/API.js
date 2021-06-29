export const API = {
  AGENTS: {
    AGENT: 'agent',
    SAS_AGENT: 'sas'
  },
  COMMAND: '/cmd/id/',
  GET_HEALTH: '/greet',
  STATUS: {
    ERROR: 'error',
    COMPLETED: 'completed',
    IN_PROGRESS: 'in-progress'
  },
  HEAD: '/agent/head?file=',
  FOLDER: '/files?folder=',
  ERROR_PATH: ['data', 'state', 'errorCause'],
  READ_BYTES_PATH: ['data', 'result', 'status', 'read-bytes'],
  HANDLE_PUT: (env, data, url, token) => {
    if (env === 'development') {
      return ({
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: data,
        url: url
      })
    } else {
      return ({
        data: data,
        url: url
      })
    }
  },
  OPERATIONS: ['any-import', 'csv-import', 'json-import', 'archive-import'],
  ASSIGN_COMMANDS: fileExtension => {
    let commands = [API.OPERATIONS[0]]

    switch (fileExtension) {
      case 'csv':
        commands.push(API.OPERATIONS[1])
        break

      case 'json':
        commands.push(API.OPERATIONS[2])
        break

      case 'zip':
        commands.push(API.OPERATIONS[3])
        break

      default:
    }

    return commands
  },
  LINES_TO_SHOW_OPTIONS: (length) => Array.from({ length: length }, (x, i) => {
    const lines = i + 2

    return ({
      key: lines,
      text: lines,
      value: lines
    })
  }),
  ENCODE_OPTIONS: [
    {
      key: 'UTF-8',
      text: 'Unicode 8',
      value: 'UTF-8'
    },
    {
      key: 'us-ascii',
      text: 'US-ASCII (7-bit)',
      value: 'us-ascii'
    },
    {
      key: 'ISO-8859-1',
      text: 'Windows Latin-1',
      value: 'ISO-8859-1'
    }
  ],
  DELIMITER_OPTIONS: [
    {
      key: ';',
      text: ';',
      value: ';'
    },
    {
      key: ',',
      text: ',',
      value: ','
    },
    {
      key: '|',
      text: '|',
      value: '|'
    }
    ,
    {
      key: '§',
      text: '§',
      value: '§'
    }
    ,
    {
      key: '\\t',
      text: '\\t',
      value: '\\t'
    }
  ],
  AVRO_TYPE_OPTIONS: [
    { key: 'String', text: 'String', value: 'String' },
    { key: 'Integer', text: 'Integer', value: 'Integer' },
    { key: 'Float', text: 'Float', value: 'Float' },
    { key: 'Double', text: 'Double', value: 'Double' },
    { key: 'Long', text: 'Long', value: 'Long' }
  ],
  BOUNDARY_OPTIONS: [
    { key: 'BOUNDED', text: 'BOUNDED', value: 'BOUNDED' },
    { key: 'UNBOUNDED', text: 'UNBOUNDED', value: 'UNBOUNDED' }
  ],
  VALUATION_OPTIONS: ['OPEN', 'INTERNAL', 'SHIELDED', 'SENSITIVE', 'UNRECOGNIZED'].map(valuation => ({
    key: valuation,
    text: valuation,
    value: valuation
  }))
}

export const API_INSTRUCTIONS = {
  SCAN: (id, path) => ({
    'id': id,
    'command': {
      'target': 'sas-agent',
      'cmd': 'scan',
      'args': {
        'path': path,
        'recursive': true
      }
    },
    'state': {}
  }),
  COPY: (id, file) => ({
    'id': id,
    'command': {
      'target': 'sas-agent',
      'cmd': 'copy',
      'args': {
        'path': file
      }
    },
    'state': {}
  }),
  HEAD: (id, file, lines) => ({
    'id': id,
    'command': {
      'target': 'agent',
      'cmd': 'head',
      'args': {
        'file': file,
        'lines': lines
      }
    },
    'state': {}
  }),
  ANY_IMPORT: (id, files) => ({
    'id': id,
    'command': {
      'target': 'agent',
      'cmd': 'any-import',
      'args': {
        'template': {
          'files': files
        }
      }
    },
    'state': {}
  }),
  CSV_INSPECT: (id, files, delimiter, charset) => ({
    'id': id,
    'command': {
      'target': 'agent',
      'cmd': 'determine-csv-import-structure',
      'args': {
        'template': {
          'files': files,
          'structure': {
            'schema': {
              'delimiter': delimiter,
              'charset': charset
            }
          }
        }
      }
    },
    'state': {}
  }),
  CSV_IMPORT: (id, files, delimiter, charset, columns, boundaryType, valuation, convertAfterImport, converterSkipOnFailure) => ({
    'id': id,
    'command': {
      'target': 'agent',
      'cmd': 'csv-import',
      'args': {
        'template': {
          'files': files,
          'structure': {
            'schema': {
              'delimiter': delimiter,
              'charset': charset,
              'columns': columns
            },
            'uri': 'inline:csv'
          },
          'metadata': {
            'boundaryType': boundaryType,
            'valuation': valuation
          }
        },
        'convertAfterImport': convertAfterImport,
        'converterSkipOnFailure': converterSkipOnFailure
      }
    },
    'state': {}
  })
}
