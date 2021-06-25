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
  FOLDER: '/files?folder=',
  ERROR_PATH: ['data', 'state', 'errorCause'],
  READ_BYTES_PATH : ['data', 'result', 'status', 'read-bytes'],
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
  }
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
  })
}
