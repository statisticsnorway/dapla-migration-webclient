import { LANGUAGE } from '@statisticsnorway/dapla-js-utilities'
import { API } from './API'

const file = 'file.txt'
const folder = '/test/a/path'
const fullPath = `${folder}/${file}`
const timestamp = '2011-10-05T14:48:00.000Z'
const template = {
  files: [`${folder}/file.csv`],
  metadata: {
    boundaryType: 'BOUNDED',
    valuation: 'INTERNAL'
  },
  structure: {
    schema: {
      delimiter: ';',
      charset: 'UTF-8',
      columns: [
        {
          name: 'Some',
          type: 'Long'
        },
        {
          name: 'Cool',
          type: 'Long'
        },
        {
          name: 'Thing',
          type: 'String'
        }
      ]
    },
    uri: 'inline:csv'
  }
}

export const TEST_CONFIGURATIONS = {
  alternativeApi: 'http://localhost:9999',
  apiContext: (fn, fn2, fn3, advancedUser = false) => ({
    api: window.__ENV.REACT_APP_API,
    setApi: fn,
    advancedUser: advancedUser,
    setAdvancedUser: fn2,
    devToken: '',
    setDevToken: fn3
  }),
  testFileObjects: [
    {
      size: 123,
      filename: file,
      folder: folder,
      created: timestamp,
      modified: '2012-10-05T14:48:00.000Z'
    },
    {
      size: 456,
      filename: 'file2.txt',
      folder: '/test/b/path',
      created: timestamp,
      modified: '2014-10-05T14:48:00.000Z'
    }
  ],
  testFile: {
    file: fullPath,
    fileSize: 123
  },
  testFileStatus: (file, command) => ({
    file: file,
    command: command
  }),
  testFileStatusCopy: {
    command: {
      args: {
        path: fullPath
      },
      cmd: 'copy',
      target: 'sas-agent'
    }
  },
  testFileStatusAnyImport: {
    command: {
      args: {
        template: {
          files: [fullPath]
        }
      },
      cmd: 'any-import',
      target: 'agent'
    }
  },
  testFileStatusCsvImport: {
    command: {
      args: {
        convertAfterImport: false,
        converterSkipOnFailure: false,
        template: template
      },
      cmd: 'csv-import',
      target: 'agent'
    }
  },
  testFileDataDecoded: ['1;2;string'],
  testFileIsCompletedData: {
    state: {
      startTime: timestamp,
      timestamp: '2011-10-05T15:48:00.000Z',
      status: API.STATUS.COMPLETED
    },
    result: {
      files: [
        {
          size: 123,
          filename: file,
          folder: folder,
          created: timestamp,
          modified: timestamp
        }
      ],
      status: { status: 'test-status' }
    }
  },
  csvTestFileCompletedData: {
    result: {
      template: template
    }
  },
  testMockResolve: (status, resultStatus, error = false) => {
    if (error) {
      return ({
        data: {
          state: { startTime: timestamp, status: API.STATUS.ERROR, errorCause: error },
          result: { status: { status: 'test-status' } }
        }
      })
    } else {
      return ({
        data: {
          state: { startTime: timestamp, status: status },
          result: { status: resultStatus }
        }
      })
    }
  },
  flushPromises: () => new Promise(res => process.nextTick(res)),
  uuidTest: 'uuidTest',
  errorString: 'A problem occurred',
  language: LANGUAGE.LANGUAGES.NORWEGIAN.languageCode,
  otherLanguage: LANGUAGE.LANGUAGES.ENGLISH.languageCode,
  responseObject: { data: { statusCode: 200 } }
}
